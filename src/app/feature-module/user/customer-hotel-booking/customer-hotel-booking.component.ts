import { Component } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { apiResultFormat, HotelDetails } from '../../../shared/models/models';
import { pageSelection, PaginationService, tablePageSize } from '../../../shared/custom-pagination/pagination.service';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../shared/data/data.service';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { BookingService } from '../../../services/booking/booking.service';
import { PropertiesService } from '../../../services/properties/properties.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-customer-hotel-booking',
  standalone: false,
  
  templateUrl: './customer-hotel-booking.component.html',
  styleUrl: './customer-hotel-booking.component.scss'
})
export class CustomerHotelBookingComponent {
public routes = routes;

page: number = 1;
  bookings: any[]=[];
  searchValue: string = '';
  properties: any;
  selectedPropertyId: string = '';

    
  selectedPropertyType: string = '';
  selectedStatus: string = '';

  // pagination variables

  initChecked = false;
  selectedTime: Date = new Date(); 
  dropdownOpen = false;
  dropdownOpen1 = false;
  dropdownOpen2 = false;
  // pagination variables
  public pageSize = 10;
  public tableData: HotelDetails[] = [];
  public tableDataCopy: HotelDetails[] = [];
  public actualData: HotelDetails[] = [];
  public currentPage = 1;
  public skip = 0;
  public limit: number = this.pageSize;
  public serialNumberArray: number[] = [];
  public totalData = 0;
  showFilter = false;
  public pageSelection: pageSelection[] = [];
  dataSource!: MatTableDataSource<HotelDetails>;
  public searchDataValue = '';
  public password: boolean[] = [false,false,false,false];
  isOpen = false
  togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }
  openSuccessModal() {
    this.isOpen = !this.isOpen;
  }
  ngOnDestroy(): void {
    this.isOpen = false
  }
  constructor(
    private data: DataService,
    private router: Router,
    private pagination: PaginationService,
    private bookingService: BookingService,
    private propertiesService: PropertiesService,
  ) {
    this.data.getHotelBooking().subscribe((apiRes: apiResultFormat) => {
      this.actualData = apiRes.data;
      this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
        if (this.router.url == this.routes.customerHotelBooking) {
          this.getTableData({ skip: res.skip, limit: res.limit });
          this.pageSize = res.pageSize;
        }
      });
    });
  }

  ngOnInit(): void {
    this.getBookingList();
    this.getProperties();

  }
  private getTableData(pageOption: pageSelection): void {
    this.data.getAgentHotel().subscribe((apiRes: apiResultFormat) => {
      this.tableData = [];
      this.tableDataCopy = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: HotelDetails, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.tableData.push(res);
          this.tableDataCopy.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<HotelDetails>(this.actualData);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.tableData,
        tableDataCopy: this.tableDataCopy,
        serialNumberArray: this.serialNumberArray,
      });
    });
  }

  public searchData(value: string): void {
    if (value == '') {
      this.tableData = this.tableDataCopy;
    } else {
      this.dataSource.filter = value.trim().toLowerCase();
      this.tableData = this.dataSource.filteredData;
    }
  }

    private getProperties(): void {
    this.propertiesService.getProperties(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.properties = response.data.properties;

        } else {
          console.error('Failed to load properties:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }

  public sortData(sort: Sort) {
    const data = this.tableData.slice();

    if (!sort.active || sort.direction === '') {
      this.tableData = data;
    } else {
      this.tableData = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];

        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
  public changePageSize(pageSize: number): void {
    this.pageSelection = [];
    this.limit = pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.pagination.tablePageSize.next({
      skip: this.skip,
      limit: this.limit,
      pageSize: this.pageSize,
    });
  }

  private getBookingList(): void {

  let params = new HttpParams();

      if (this.selectedPropertyType) {
        params = params.set('property_type', this.selectedPropertyType);
      }

      if (this.selectedStatus) {
        params = params.set('status', this.selectedStatus);
      }

      if (this.searchDataValue) {
        params = params.set('search', this.searchDataValue);
      }
      if (this.selectedPropertyId) {
      params = params.set('propertyId', this.selectedPropertyId);
    }


    this.bookingService.getBookingList(this.page,params).subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings = response.data.bookings;
        } else {
          console.error('Failed to load booking:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }
  viewBooking(id: number): void {
    const params = new HttpParams().set('id', id);
 this.bookingService.getBookingById(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings = response.data.bookings;
        } else {
          console.error('Failed to load booking:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });}

    searchFunction(value: string) {
  this.searchDataValue = value;
  this.getBookingList();
}
onTypeChange(type: string) {
  this.selectedPropertyType = type;
  this.getBookingList();
}

onStatusChange(status: string) {
  this.selectedStatus = status;
  this.getBookingList();
}
onPropertyChange(id: string) {
  this.selectedPropertyId = id;
  this.getBookingList();
}
get selectedPropertyName(): string {
  if (!this.selectedPropertyId) return 'All';

  const found = this.properties.find((p: any) => p.id === this.selectedPropertyId);
  return found ? found.name : 'Unknown';
}}
