import { NextFunction, Request, Response } from "express";
import { cToBooleanSafe, errorResponse, hasData, toJson } from "node_custom_utils";
import { AppDataSource } from "../../../../src/data_source/data_source";
import { getPaginationValues } from "../../../../utils/pagination";
import { Category } from "../../../../src/entity/category";
import { Property } from "../../../../src/entity/properties";
import { Booking } from "../../../../src/entity/booking";
import { BookingStatus } from "../../../../src/entity/enum";
import { PropertyVariants } from "../../../../src/entity/property_veriants";


export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { variantId, startDate, endDate, unitsRequested } = req.body;

    // 1) Validate required inputs
    if (![variantId, startDate, endDate, unitsRequested].every(hasData)) {
      return errorResponse(
        res,
        '`variantId`, `startDate`, `endDate` and `unitsRequested` are required.'
      );
    }

    // 2) Parse DD/MM/YYYY → JS Date
    const parseDMY = (str: string): Date => {
      const [d, m, y] = str.split('/').map(Number);
      if (![d, m, y].every(n => Number.isInteger(n))) {
        throw new Error(`Invalid date format: "${str}" (expected DD/MM/YYYY)`);
      }
      return new Date(y, m - 1, d);
    };

    let sDate: Date;
    let eDate: Date;
    try {
      sDate = parseDMY(startDate as string);
      eDate = parseDMY(endDate as string);
    } catch (e: any) {
      return errorResponse(res, e.message);
    }

    // 3) Ensure end ≥ start
    if (eDate < sDate) {
      return errorResponse(res, '`endDate` must be the same as or after `startDate`.');
    }

    const variantRepo = AppDataSource.getRepository(PropertyVariants);
    const bookingRepo = AppDataSource.getRepository(Booking);

    // 4) Load the variant
    const variant = await variantRepo.findOne({
      where: { id: String(variantId) },
      // relations: ['property'],   // uncomment if you need to access variant.property
    });
    if (!variant) {
      return errorResponse(res, `Variant ${variantId} not found.`);
    }

    // 5) Debug logging: check that you actually loaded the variant and its capacity
    console.log('Loaded variant ➜', variant);
    console.log('total_units_available ➜', variant.total_units_available);

    // 6) Build & log the bookings‑sum query (using the underlying column name)
    const qb = bookingRepo
      .createQueryBuilder('b')
      .select('SUM(b.unitsBooked)', 'bookedUnits')
      .where('b.variantId = :vid', { vid: variantId })
      .andWhere('b.status IN (:...st)', {
        st: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN],
      })
      .andWhere('b.startDate <= :eDate AND b.endDate >= :sDate', { sDate, eDate });
    
    console.log('SQL ➜', qb.getSql());
    console.log('Params ➜', qb.getParameters());

    // 7) Execute and compute availability
    const { bookedUnits } = await qb.getRawOne<{ bookedUnits: string | null }>();
    const alreadyBooked  = bookedUnits ? parseInt(bookedUnits, 10) : 0;
    const totalAvailable = variant.total_units_available ?? 0;
    const availableUnits = Math.max(0, totalAvailable - alreadyBooked);
    const requested      = Number(unitsRequested);

    // 8) Return the JSON payload
    return toJson(res, {
      data: { availableUnits, canBook: requested <= availableUnits },
      message: requested <= availableUnits
        ? `You can book ${requested} unit(s).`
        : `Only ${availableUnits} unit(s) available.`
    });

  } catch (err: any) {
    // unexpected error
    return errorResponse(res, err.message ?? 'Internal server error');
  }
};