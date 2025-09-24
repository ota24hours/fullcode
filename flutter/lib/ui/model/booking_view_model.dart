
class BookingViewModel {
    bool? success;
    String? message;
    String? instance;
    Data? data;

    BookingViewModel({this.success, this.message, this.instance, this.data});

    BookingViewModel.fromJson(Map<String, dynamic> json) {
        if(json["success"] is bool) {
            success = json["success"];
        }
        if(json["message"] is String) {
            message = json["message"];
        }
        if(json["instance"] is String) {
            instance = json["instance"];
        }
        if(json["data"] is Map) {
            data = json["data"] == null ? null : Data.fromJson(json["data"]);
        }
    }

    static List<BookingViewModel> fromList(List<Map<String, dynamic>> list) {
        return list.map(BookingViewModel.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["success"] = success;
        _data["message"] = message;
        _data["instance"] = instance;
        if(data != null) {
            _data["data"] = data?.toJson();
        }
        return _data;
    }
}

class Data {
    String? id;
    String? startDate;
    String? endDate;
    int? unitsBooked;
    String? baseAmount;
    String? taxAmount;
    String? extrasAmount;
    String? totalAmount;
    String? paymentType;
    String? status;
    dynamic paymentGatewayId;
    dynamic paymentOrderId;
    String? createdAt;
    String? updatedAt;
    Property? property;
    Variant? variant;
    User? user;

    Data({this.id, this.startDate, this.endDate, this.unitsBooked, this.baseAmount, this.taxAmount, this.extrasAmount, this.totalAmount, this.paymentType, this.status, this.paymentGatewayId, this.paymentOrderId, this.createdAt, this.updatedAt, this.property, this.variant, this.user});

    Data.fromJson(Map<String, dynamic> json) {
        if(json["id"] is String) {
            id = json["id"];
        }
        if(json["startDate"] is String) {
            startDate = json["startDate"];
        }
        if(json["endDate"] is String) {
            endDate = json["endDate"];
        }
        if(json["unitsBooked"] is int) {
            unitsBooked = json["unitsBooked"];
        }
        if(json["baseAmount"] is String) {
            baseAmount = json["baseAmount"];
        }
        if(json["taxAmount"] is String) {
            taxAmount = json["taxAmount"];
        }
        if(json["extrasAmount"] is String) {
            extrasAmount = json["extrasAmount"];
        }
        if(json["totalAmount"] is String) {
            totalAmount = json["totalAmount"];
        }
        if(json["paymentType"] is String) {
            paymentType = json["paymentType"];
        }
        if(json["status"] is String) {
            status = json["status"];
        }
        paymentGatewayId = json["paymentGatewayId"];
        paymentOrderId = json["paymentOrderId"];
        if(json["createdAt"] is String) {
            createdAt = json["createdAt"];
        }
        if(json["updatedAt"] is String) {
            updatedAt = json["updatedAt"];
        }
        if(json["property"] is Map) {
            property = json["property"] == null ? null : Property.fromJson(json["property"]);
        }
        if(json["variant"] is Map) {
            variant = json["variant"] == null ? null : Variant.fromJson(json["variant"]);
        }
        if(json["user"] is Map) {
            user = json["user"] == null ? null : User.fromJson(json["user"]);
        }
    }

    static List<Data> fromList(List<Map<String, dynamic>> list) {
        return list.map(Data.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["id"] = id;
        _data["startDate"] = startDate;
        _data["endDate"] = endDate;
        _data["unitsBooked"] = unitsBooked;
        _data["baseAmount"] = baseAmount;
        _data["taxAmount"] = taxAmount;
        _data["extrasAmount"] = extrasAmount;
        _data["totalAmount"] = totalAmount;
        _data["paymentType"] = paymentType;
        _data["status"] = status;
        _data["paymentGatewayId"] = paymentGatewayId;
        _data["paymentOrderId"] = paymentOrderId;
        _data["createdAt"] = createdAt;
        _data["updatedAt"] = updatedAt;
        if(property != null) {
            _data["property"] = property?.toJson();
        }
        if(variant != null) {
            _data["variant"] = variant?.toJson();
        }
        if(user != null) {
            _data["user"] = user?.toJson();
        }
        return _data;
    }
}

class User {
    String? id;
    String? name;
    String? phone;
    String? email;

    User({this.id, this.name, this.phone, this.email});

    User.fromJson(Map<String, dynamic> json) {
        if(json["id"] is String) {
            id = json["id"];
        }
        if(json["name"] is String) {
            name = json["name"];
        }
        if(json["phone"] is String) {
            phone = json["phone"];
        }
        if(json["email"] is String) {
            email = json["email"];
        }
    }

    static List<User> fromList(List<Map<String, dynamic>> list) {
        return list.map(User.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["id"] = id;
        _data["name"] = name;
        _data["phone"] = phone;
        _data["email"] = email;
        return _data;
    }
}

class Variant {
    String? id;
    String? name;
    String? rate;
    String? minRate;
    String? waitingRate;
    String? dailyRate;
    String? boatType;
    String? percentage;
    List<ExtraData1>? extraData;
    List<DetailsData1>? detailsData;
    String? tax;
    String? maxPerson;
    String? childCount;
    String? totalUnitsAvailable;
    String? personAllowed;
    bool? extraBedAvailable;
    String? rateForExtraBed;
    String? imgUrl;
    String? capacity;
    String? staff;
    String? lifeBoys;
    String? lifeJacket;
    String? boatMaterial;
    String? fireSafety;
    String? emergencyNumber;
    String? capacityTransport;
    String? vehicleNumber;
    String? permitExpiry;
    String? fitnessExpiry;
    String? rcNumber;
    String? rcExpiry;
    String? pucNumber;
    String? pucExpiry;
    String? insuranceNumber;
    String? insuranceExpiry;
    String? details;
    String? fitnessNumber;
    String? permitNumber;
    String? oneDayMinRate;
    String? oneDayIncludedKm;
    String? oneDayIncludedHours;
    String? oneDayAddKm;
    String? oneDayAddHr;
    String? oneDayBata;
    String? twoDayMinRate;
    String? twoDayIncludedKm;
    String? twoDayIncludedHours;
    String? twoDayAddKm;
    String? twoDayAddHr;
    String? twoDayBata;
    String? threeDayMinRate;
    String? threeDayIncludedKm;
    String? threeDayIncludedHours;
    String? threeDayAddKm;
    String? dinnerRate;
    String? lunchRate;
    String? breakfastRate;
    String? extraHourRate;
    String? extraPersonRate;
    String? threeDayAddHr;
    String? threeDayBata;
    String? eventTime;
    String? eventDate;
    dynamic additionalRateKm;
    dynamic kmMinRate;
    String? createdAt;
    String? updatedAt;

    Variant({this.id, this.name, this.rate, this.minRate, this.waitingRate, this.dailyRate, this.boatType, this.percentage, this.extraData, this.detailsData, this.tax, this.maxPerson, this.childCount, this.totalUnitsAvailable, this.personAllowed, this.extraBedAvailable, this.rateForExtraBed, this.imgUrl, this.capacity, this.staff, this.lifeBoys, this.lifeJacket, this.boatMaterial, this.fireSafety, this.emergencyNumber, this.capacityTransport, this.vehicleNumber, this.permitExpiry, this.fitnessExpiry, this.rcNumber, this.rcExpiry, this.pucNumber, this.pucExpiry, this.insuranceNumber, this.insuranceExpiry, this.details, this.fitnessNumber, this.permitNumber, this.oneDayMinRate, this.oneDayIncludedKm, this.oneDayIncludedHours, this.oneDayAddKm, this.oneDayAddHr, this.oneDayBata, this.twoDayMinRate, this.twoDayIncludedKm, this.twoDayIncludedHours, this.twoDayAddKm, this.twoDayAddHr, this.twoDayBata, this.threeDayMinRate, this.threeDayIncludedKm, this.threeDayIncludedHours, this.threeDayAddKm, this.dinnerRate, this.lunchRate, this.breakfastRate, this.extraHourRate, this.extraPersonRate, this.threeDayAddHr, this.threeDayBata, this.eventTime, this.eventDate, this.additionalRateKm, this.kmMinRate, this.createdAt, this.updatedAt});

    Variant.fromJson(Map<String, dynamic> json) {
        if(json["id"] is String) {
            id = json["id"];
        }
        if(json["name"] is String) {
            name = json["name"];
        }
        if(json["rate"] is String) {
            rate = json["rate"];
        }
        if(json["min_rate"] is String) {
            minRate = json["min_rate"];
        }
        if(json["waiting_rate"] is String) {
            waitingRate = json["waiting_rate"];
        }
        if(json["daily_rate"] is String) {
            dailyRate = json["daily_rate"];
        }
        if(json["boat_type"] is String) {
            boatType = json["boat_type"];
        }
        if(json["percentage"] is String) {
            percentage = json["percentage"];
        }
        if(json["extraData"] is List) {
            extraData = json["extraData"] == null ? null : (json["extraData"] as List).map((e) => ExtraData1.fromJson(e)).toList();
        }
        if(json["detailsData"] is List) {
            detailsData = json["detailsData"] == null ? null : (json["detailsData"] as List).map((e) => DetailsData1.fromJson(e)).toList();
        }
        if(json["tax"] is String) {
            tax = json["tax"];
        }
        if(json["max_person"] is String) {
            maxPerson = json["max_person"];
        }
        if(json["child_count"] is String) {
            childCount = json["child_count"];
        }
        if(json["total_units_available"] is String) {
            totalUnitsAvailable = json["total_units_available"];
        }
        if(json["person_allowed"] is String) {
            personAllowed = json["person_allowed"];
        }
        if(json["extra_bed_available"] is bool) {
            extraBedAvailable = json["extra_bed_available"];
        }
        if(json["rate_for_extra_bed"] is String) {
            rateForExtraBed = json["rate_for_extra_bed"];
        }
        if(json["img_url"] is String) {
            imgUrl = json["img_url"];
        }
        if(json["capacity"] is String) {
            capacity = json["capacity"];
        }
        if(json["staff"] is String) {
            staff = json["staff"];
        }
        if(json["lifeBoys"] is String) {
            lifeBoys = json["lifeBoys"];
        }
        if(json["lifeJacket"] is String) {
            lifeJacket = json["lifeJacket"];
        }
        if(json["boat_material"] is String) {
            boatMaterial = json["boat_material"];
        }
        if(json["fire_safety"] is String) {
            fireSafety = json["fire_safety"];
        }
        if(json["emergency_number"] is String) {
            emergencyNumber = json["emergency_number"];
        }
        if(json["capacity_transport"] is String) {
            capacityTransport = json["capacity_transport"];
        }
        if(json["vehicle_number"] is String) {
            vehicleNumber = json["vehicle_number"];
        }
        if(json["permit_expiry"] is String) {
            permitExpiry = json["permit_expiry"];
        }
        if(json["fitness_expiry"] is String) {
            fitnessExpiry = json["fitness_expiry"];
        }
        if(json["rc_number"] is String) {
            rcNumber = json["rc_number"];
        }
        if(json["rc_expiry"] is String) {
            rcExpiry = json["rc_expiry"];
        }
        if(json["puc_number"] is String) {
            pucNumber = json["puc_number"];
        }
        if(json["puc_expiry"] is String) {
            pucExpiry = json["puc_expiry"];
        }
        if(json["insurance_number"] is String) {
            insuranceNumber = json["insurance_number"];
        }
        if(json["insurance_expiry"] is String) {
            insuranceExpiry = json["insurance_expiry"];
        }
        if(json["details"] is String) {
            details = json["details"];
        }
        if(json["fitness_number"] is String) {
            fitnessNumber = json["fitness_number"];
        }
        if(json["permit_number"] is String) {
            permitNumber = json["permit_number"];
        }
        if(json["one_day_min_rate"] is String) {
            oneDayMinRate = json["one_day_min_rate"];
        }
        if(json["one_day_included_km"] is String) {
            oneDayIncludedKm = json["one_day_included_km"];
        }
        if(json["one_day_included_hours"] is String) {
            oneDayIncludedHours = json["one_day_included_hours"];
        }
        if(json["one_day_add_km"] is String) {
            oneDayAddKm = json["one_day_add_km"];
        }
        if(json["one_day_add_hr"] is String) {
            oneDayAddHr = json["one_day_add_hr"];
        }
        if(json["one_day_bata"] is String) {
            oneDayBata = json["one_day_bata"];
        }
        if(json["two_day_min_rate"] is String) {
            twoDayMinRate = json["two_day_min_rate"];
        }
        if(json["two_day_included_km"] is String) {
            twoDayIncludedKm = json["two_day_included_km"];
        }
        if(json["two_day_included_hours"] is String) {
            twoDayIncludedHours = json["two_day_included_hours"];
        }
        if(json["two_day_add_km"] is String) {
            twoDayAddKm = json["two_day_add_km"];
        }
        if(json["two_day_add_hr"] is String) {
            twoDayAddHr = json["two_day_add_hr"];
        }
        if(json["two_day_bata"] is String) {
            twoDayBata = json["two_day_bata"];
        }
        if(json["three_day_min_rate"] is String) {
            threeDayMinRate = json["three_day_min_rate"];
        }
        if(json["three_day_included_km"] is String) {
            threeDayIncludedKm = json["three_day_included_km"];
        }
        if(json["three_day_included_hours"] is String) {
            threeDayIncludedHours = json["three_day_included_hours"];
        }
        if(json["three_day_add_km"] is String) {
            threeDayAddKm = json["three_day_add_km"];
        }
        if(json["dinner_rate"] is String) {
            dinnerRate = json["dinner_rate"];
        }
        if(json["lunch_rate"] is String) {
            lunchRate = json["lunch_rate"];
        }
        if(json["breakfast_rate"] is String) {
            breakfastRate = json["breakfast_rate"];
        }
        if(json["extra_hour_rate"] is String) {
            extraHourRate = json["extra_hour_rate"];
        }
        if(json["extra_person_rate"] is String) {
            extraPersonRate = json["extra_person_rate"];
        }
        if(json["three_day_add_hr"] is String) {
            threeDayAddHr = json["three_day_add_hr"];
        }
        if(json["three_day_bata"] is String) {
            threeDayBata = json["three_day_bata"];
        }
        if(json["event_time"] is String) {
            eventTime = json["event_time"];
        }
        if(json["event_date"] is String) {
            eventDate = json["event_date"];
        }
        additionalRateKm = json["additional_rate_km"];
        kmMinRate = json["km_min_rate"];
        if(json["createdAt"] is String) {
            createdAt = json["createdAt"];
        }
        if(json["updatedAt"] is String) {
            updatedAt = json["updatedAt"];
        }
    }

    static List<Variant> fromList(List<Map<String, dynamic>> list) {
        return list.map(Variant.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["id"] = id;
        _data["name"] = name;
        _data["rate"] = rate;
        _data["min_rate"] = minRate;
        _data["waiting_rate"] = waitingRate;
        _data["daily_rate"] = dailyRate;
        _data["boat_type"] = boatType;
        _data["percentage"] = percentage;
        if(extraData != null) {
            _data["extraData"] = extraData?.map((e) => e.toJson()).toList();
        }
        if(detailsData != null) {
            _data["detailsData"] = detailsData?.map((e) => e.toJson()).toList();
        }
        _data["tax"] = tax;
        _data["max_person"] = maxPerson;
        _data["child_count"] = childCount;
        _data["total_units_available"] = totalUnitsAvailable;
        _data["person_allowed"] = personAllowed;
        _data["extra_bed_available"] = extraBedAvailable;
        _data["rate_for_extra_bed"] = rateForExtraBed;
        _data["img_url"] = imgUrl;
        _data["capacity"] = capacity;
        _data["staff"] = staff;
        _data["lifeBoys"] = lifeBoys;
        _data["lifeJacket"] = lifeJacket;
        _data["boat_material"] = boatMaterial;
        _data["fire_safety"] = fireSafety;
        _data["emergency_number"] = emergencyNumber;
        _data["capacity_transport"] = capacityTransport;
        _data["vehicle_number"] = vehicleNumber;
        _data["permit_expiry"] = permitExpiry;
        _data["fitness_expiry"] = fitnessExpiry;
        _data["rc_number"] = rcNumber;
        _data["rc_expiry"] = rcExpiry;
        _data["puc_number"] = pucNumber;
        _data["puc_expiry"] = pucExpiry;
        _data["insurance_number"] = insuranceNumber;
        _data["insurance_expiry"] = insuranceExpiry;
        _data["details"] = details;
        _data["fitness_number"] = fitnessNumber;
        _data["permit_number"] = permitNumber;
        _data["one_day_min_rate"] = oneDayMinRate;
        _data["one_day_included_km"] = oneDayIncludedKm;
        _data["one_day_included_hours"] = oneDayIncludedHours;
        _data["one_day_add_km"] = oneDayAddKm;
        _data["one_day_add_hr"] = oneDayAddHr;
        _data["one_day_bata"] = oneDayBata;
        _data["two_day_min_rate"] = twoDayMinRate;
        _data["two_day_included_km"] = twoDayIncludedKm;
        _data["two_day_included_hours"] = twoDayIncludedHours;
        _data["two_day_add_km"] = twoDayAddKm;
        _data["two_day_add_hr"] = twoDayAddHr;
        _data["two_day_bata"] = twoDayBata;
        _data["three_day_min_rate"] = threeDayMinRate;
        _data["three_day_included_km"] = threeDayIncludedKm;
        _data["three_day_included_hours"] = threeDayIncludedHours;
        _data["three_day_add_km"] = threeDayAddKm;
        _data["dinner_rate"] = dinnerRate;
        _data["lunch_rate"] = lunchRate;
        _data["breakfast_rate"] = breakfastRate;
        _data["extra_hour_rate"] = extraHourRate;
        _data["extra_person_rate"] = extraPersonRate;
        _data["three_day_add_hr"] = threeDayAddHr;
        _data["three_day_bata"] = threeDayBata;
        _data["event_time"] = eventTime;
        _data["event_date"] = eventDate;
        _data["additional_rate_km"] = additionalRateKm;
        _data["km_min_rate"] = kmMinRate;
        _data["createdAt"] = createdAt;
        _data["updatedAt"] = updatedAt;
        return _data;
    }
}

class DetailsData1 {
    String? key;
    String? value;
    String? iconUrl;
    String? mainOptions;

    DetailsData1({this.key, this.value, this.iconUrl, this.mainOptions});

    DetailsData1.fromJson(Map<String, dynamic> json) {
        if(json["key"] is String) {
            key = json["key"];
        }
        if(json["value"] is String) {
            value = json["value"];
        }
        if(json["icon_url"] is String) {
            iconUrl = json["icon_url"];
        }
        if(json["mainOptions"] is String) {
            mainOptions = json["mainOptions"];
        }
    }

    static List<DetailsData1> fromList(List<Map<String, dynamic>> list) {
        return list.map(DetailsData1.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["key"] = key;
        _data["value"] = value;
        _data["icon_url"] = iconUrl;
        _data["mainOptions"] = mainOptions;
        return _data;
    }
}

class ExtraData1 {
    String? key;
    bool? value;
    String? iconUrl;
    String? mainOptions;

    ExtraData1({this.key, this.value, this.iconUrl, this.mainOptions});

    ExtraData1.fromJson(Map<String, dynamic> json) {
        if(json["key"] is String) {
            key = json["key"];
        }
        if(json["value"] is bool) {
            value = json["value"];
        }
        if(json["icon_url"] is String) {
            iconUrl = json["icon_url"];
        }
        if(json["mainOptions"] is String) {
            mainOptions = json["mainOptions"];
        }
    }

    static List<ExtraData1> fromList(List<Map<String, dynamic>> list) {
        return list.map(ExtraData1.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["key"] = key;
        _data["value"] = value;
        _data["icon_url"] = iconUrl;
        _data["mainOptions"] = mainOptions;
        return _data;
    }
}

class Property {
    String? id;
    String? propertyType;
    String? boatType;
    String? name;
    dynamic included;
    String? distances;
    dynamic nearbyAttractions;
    String? tradeName;
    String? image;
    String? description;
    dynamic termsAndConditions;
    dynamic rate;
    String? latitude;
    String? longitude;
    dynamic totalUnits;
    bool? isActive;
    dynamic capacity;
    dynamic make;
    dynamic model;
    dynamic registrationNumber;
    dynamic transmission;
    dynamic roomNumber;
    dynamic bedCount;
    dynamic amenities;
    bool? hasBreakfastIncluded;
    String? place;
    String? district;
    String? state;
    String? pincode;
    dynamic boatName;
    dynamic boatRegistrationNo;
    bool? hasDiningFacility;
    dynamic eventStartDate;
    dynamic eventEndDate;
    dynamic eventLocation;
    String? createdAt;
    String? updatedAt;
    List<PropertyVariants>? propertyVariants;

    Property({this.id, this.propertyType, this.boatType, this.name, this.included, this.distances, this.nearbyAttractions, this.tradeName, this.image, this.description, this.termsAndConditions, this.rate, this.latitude, this.longitude, this.totalUnits, this.isActive, this.capacity, this.make, this.model, this.registrationNumber, this.transmission, this.roomNumber, this.bedCount, this.amenities, this.hasBreakfastIncluded, this.place, this.district, this.state, this.pincode, this.boatName, this.boatRegistrationNo, this.hasDiningFacility, this.eventStartDate, this.eventEndDate, this.eventLocation, this.createdAt, this.updatedAt, this.propertyVariants});

    Property.fromJson(Map<String, dynamic> json) {
        if(json["id"] is String) {
            id = json["id"];
        }
        if(json["propertyType"] is String) {
            propertyType = json["propertyType"];
        }
        if(json["boat_type"] is String) {
            boatType = json["boat_type"];
        }
        if(json["name"] is String) {
            name = json["name"];
        }
        included = json["Included"];
        if(json["distances"] is String) {
            distances = json["distances"];
        }
        nearbyAttractions = json["nearby_attractions"];
        if(json["trade_name"] is String) {
            tradeName = json["trade_name"];
        }
        if(json["image"] is String) {
            image = json["image"];
        }
        if(json["description"] is String) {
            description = json["description"];
        }
        termsAndConditions = json["termsAndConditions"];
        rate = json["rate"];
        if(json["latitude"] is String) {
            latitude = json["latitude"];
        }
        if(json["longitude"] is String) {
            longitude = json["longitude"];
        }
        totalUnits = json["totalUnits"];
        if(json["isActive"] is bool) {
            isActive = json["isActive"];
        }
        capacity = json["capacity"];
        make = json["make"];
        model = json["model"];
        registrationNumber = json["registrationNumber"];
        transmission = json["transmission"];
        roomNumber = json["roomNumber"];
        bedCount = json["bedCount"];
        amenities = json["amenities"];
        if(json["hasBreakfastIncluded"] is bool) {
            hasBreakfastIncluded = json["hasBreakfastIncluded"];
        }
        if(json["place"] is String) {
            place = json["place"];
        }
        if(json["district"] is String) {
            district = json["district"];
        }
        if(json["state"] is String) {
            state = json["state"];
        }
        if(json["pincode"] is String) {
            pincode = json["pincode"];
        }
        boatName = json["boatName"];
        boatRegistrationNo = json["boatRegistrationNo"];
        if(json["hasDiningFacility"] is bool) {
            hasDiningFacility = json["hasDiningFacility"];
        }
        eventStartDate = json["eventStartDate"];
        eventEndDate = json["eventEndDate"];
        eventLocation = json["eventLocation"];
        if(json["createdAt"] is String) {
            createdAt = json["createdAt"];
        }
        if(json["updatedAt"] is String) {
            updatedAt = json["updatedAt"];
        }
        if(json["property_variants"] is List) {
            propertyVariants = json["property_variants"] == null ? null : (json["property_variants"] as List).map((e) => PropertyVariants.fromJson(e)).toList();
        }
    }

    static List<Property> fromList(List<Map<String, dynamic>> list) {
        return list.map(Property.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["id"] = id;
        _data["propertyType"] = propertyType;
        _data["boat_type"] = boatType;
        _data["name"] = name;
        _data["Included"] = included;
        _data["distances"] = distances;
        _data["nearby_attractions"] = nearbyAttractions;
        _data["trade_name"] = tradeName;
        _data["image"] = image;
        _data["description"] = description;
        _data["termsAndConditions"] = termsAndConditions;
        _data["rate"] = rate;
        _data["latitude"] = latitude;
        _data["longitude"] = longitude;
        _data["totalUnits"] = totalUnits;
        _data["isActive"] = isActive;
        _data["capacity"] = capacity;
        _data["make"] = make;
        _data["model"] = model;
        _data["registrationNumber"] = registrationNumber;
        _data["transmission"] = transmission;
        _data["roomNumber"] = roomNumber;
        _data["bedCount"] = bedCount;
        _data["amenities"] = amenities;
        _data["hasBreakfastIncluded"] = hasBreakfastIncluded;
        _data["place"] = place;
        _data["district"] = district;
        _data["state"] = state;
        _data["pincode"] = pincode;
        _data["boatName"] = boatName;
        _data["boatRegistrationNo"] = boatRegistrationNo;
        _data["hasDiningFacility"] = hasDiningFacility;
        _data["eventStartDate"] = eventStartDate;
        _data["eventEndDate"] = eventEndDate;
        _data["eventLocation"] = eventLocation;
        _data["createdAt"] = createdAt;
        _data["updatedAt"] = updatedAt;
        if(propertyVariants != null) {
            _data["property_variants"] = propertyVariants?.map((e) => e.toJson()).toList();
        }
        return _data;
    }
}

class PropertyVariants {
    String? id;
    String? name;
    String? rate;
    String? minRate;
    String? waitingRate;
    String? dailyRate;
    String? boatType;
    String? percentage;
    List<ExtraData>? extraData;
    List<DetailsData>? detailsData;
    String? tax;
    String? maxPerson;
    String? childCount;
    String? totalUnitsAvailable;
    String? personAllowed;
    bool? extraBedAvailable;
    String? rateForExtraBed;
    String? imgUrl;
    String? capacity;
    String? staff;
    String? lifeBoys;
    String? lifeJacket;
    String? boatMaterial;
    String? fireSafety;
    String? emergencyNumber;
    String? capacityTransport;
    String? vehicleNumber;
    String? permitExpiry;
    String? fitnessExpiry;
    String? rcNumber;
    String? rcExpiry;
    String? pucNumber;
    String? pucExpiry;
    String? insuranceNumber;
    String? insuranceExpiry;
    String? details;
    String? fitnessNumber;
    String? permitNumber;
    String? oneDayMinRate;
    String? oneDayIncludedKm;
    String? oneDayIncludedHours;
    String? oneDayAddKm;
    String? oneDayAddHr;
    String? oneDayBata;
    String? twoDayMinRate;
    String? twoDayIncludedKm;
    String? twoDayIncludedHours;
    String? twoDayAddKm;
    String? twoDayAddHr;
    String? twoDayBata;
    String? threeDayMinRate;
    String? threeDayIncludedKm;
    String? threeDayIncludedHours;
    String? threeDayAddKm;
    String? dinnerRate;
    String? lunchRate;
    String? breakfastRate;
    String? extraHourRate;
    String? extraPersonRate;
    String? threeDayAddHr;
    String? threeDayBata;
    String? eventTime;
    String? eventDate;
    dynamic additionalRateKm;
    dynamic kmMinRate;
    String? createdAt;
    String? updatedAt;
    List<PropertyImgs>? propertyImgs;

    PropertyVariants({this.id, this.name, this.rate, this.minRate, this.waitingRate, this.dailyRate, this.boatType, this.percentage, this.extraData, this.detailsData, this.tax, this.maxPerson, this.childCount, this.totalUnitsAvailable, this.personAllowed, this.extraBedAvailable, this.rateForExtraBed, this.imgUrl, this.capacity, this.staff, this.lifeBoys, this.lifeJacket, this.boatMaterial, this.fireSafety, this.emergencyNumber, this.capacityTransport, this.vehicleNumber, this.permitExpiry, this.fitnessExpiry, this.rcNumber, this.rcExpiry, this.pucNumber, this.pucExpiry, this.insuranceNumber, this.insuranceExpiry, this.details, this.fitnessNumber, this.permitNumber, this.oneDayMinRate, this.oneDayIncludedKm, this.oneDayIncludedHours, this.oneDayAddKm, this.oneDayAddHr, this.oneDayBata, this.twoDayMinRate, this.twoDayIncludedKm, this.twoDayIncludedHours, this.twoDayAddKm, this.twoDayAddHr, this.twoDayBata, this.threeDayMinRate, this.threeDayIncludedKm, this.threeDayIncludedHours, this.threeDayAddKm, this.dinnerRate, this.lunchRate, this.breakfastRate, this.extraHourRate, this.extraPersonRate, this.threeDayAddHr, this.threeDayBata, this.eventTime, this.eventDate, this.additionalRateKm, this.kmMinRate, this.createdAt, this.updatedAt, this.propertyImgs});

    PropertyVariants.fromJson(Map<String, dynamic> json) {
        if(json["id"] is String) {
            id = json["id"];
        }
        if(json["name"] is String) {
            name = json["name"];
        }
        if(json["rate"] is String) {
            rate = json["rate"];
        }
        if(json["min_rate"] is String) {
            minRate = json["min_rate"];
        }
        if(json["waiting_rate"] is String) {
            waitingRate = json["waiting_rate"];
        }
        if(json["daily_rate"] is String) {
            dailyRate = json["daily_rate"];
        }
        if(json["boat_type"] is String) {
            boatType = json["boat_type"];
        }
        if(json["percentage"] is String) {
            percentage = json["percentage"];
        }
        if(json["extraData"] is List) {
            extraData = json["extraData"] == null ? null : (json["extraData"] as List).map((e) => ExtraData.fromJson(e)).toList();
        }
        if(json["detailsData"] is List) {
            detailsData = json["detailsData"] == null ? null : (json["detailsData"] as List).map((e) => DetailsData.fromJson(e)).toList();
        }
        if(json["tax"] is String) {
            tax = json["tax"];
        }
        if(json["max_person"] is String) {
            maxPerson = json["max_person"];
        }
        if(json["child_count"] is String) {
            childCount = json["child_count"];
        }
        if(json["total_units_available"] is String) {
            totalUnitsAvailable = json["total_units_available"];
        }
        if(json["person_allowed"] is String) {
            personAllowed = json["person_allowed"];
        }
        if(json["extra_bed_available"] is bool) {
            extraBedAvailable = json["extra_bed_available"];
        }
        if(json["rate_for_extra_bed"] is String) {
            rateForExtraBed = json["rate_for_extra_bed"];
        }
        if(json["img_url"] is String) {
            imgUrl = json["img_url"];
        }
        if(json["capacity"] is String) {
            capacity = json["capacity"];
        }
        if(json["staff"] is String) {
            staff = json["staff"];
        }
        if(json["lifeBoys"] is String) {
            lifeBoys = json["lifeBoys"];
        }
        if(json["lifeJacket"] is String) {
            lifeJacket = json["lifeJacket"];
        }
        if(json["boat_material"] is String) {
            boatMaterial = json["boat_material"];
        }
        if(json["fire_safety"] is String) {
            fireSafety = json["fire_safety"];
        }
        if(json["emergency_number"] is String) {
            emergencyNumber = json["emergency_number"];
        }
        if(json["capacity_transport"] is String) {
            capacityTransport = json["capacity_transport"];
        }
        if(json["vehicle_number"] is String) {
            vehicleNumber = json["vehicle_number"];
        }
        if(json["permit_expiry"] is String) {
            permitExpiry = json["permit_expiry"];
        }
        if(json["fitness_expiry"] is String) {
            fitnessExpiry = json["fitness_expiry"];
        }
        if(json["rc_number"] is String) {
            rcNumber = json["rc_number"];
        }
        if(json["rc_expiry"] is String) {
            rcExpiry = json["rc_expiry"];
        }
        if(json["puc_number"] is String) {
            pucNumber = json["puc_number"];
        }
        if(json["puc_expiry"] is String) {
            pucExpiry = json["puc_expiry"];
        }
        if(json["insurance_number"] is String) {
            insuranceNumber = json["insurance_number"];
        }
        if(json["insurance_expiry"] is String) {
            insuranceExpiry = json["insurance_expiry"];
        }
        if(json["details"] is String) {
            details = json["details"];
        }
        if(json["fitness_number"] is String) {
            fitnessNumber = json["fitness_number"];
        }
        if(json["permit_number"] is String) {
            permitNumber = json["permit_number"];
        }
        if(json["one_day_min_rate"] is String) {
            oneDayMinRate = json["one_day_min_rate"];
        }
        if(json["one_day_included_km"] is String) {
            oneDayIncludedKm = json["one_day_included_km"];
        }
        if(json["one_day_included_hours"] is String) {
            oneDayIncludedHours = json["one_day_included_hours"];
        }
        if(json["one_day_add_km"] is String) {
            oneDayAddKm = json["one_day_add_km"];
        }
        if(json["one_day_add_hr"] is String) {
            oneDayAddHr = json["one_day_add_hr"];
        }
        if(json["one_day_bata"] is String) {
            oneDayBata = json["one_day_bata"];
        }
        if(json["two_day_min_rate"] is String) {
            twoDayMinRate = json["two_day_min_rate"];
        }
        if(json["two_day_included_km"] is String) {
            twoDayIncludedKm = json["two_day_included_km"];
        }
        if(json["two_day_included_hours"] is String) {
            twoDayIncludedHours = json["two_day_included_hours"];
        }
        if(json["two_day_add_km"] is String) {
            twoDayAddKm = json["two_day_add_km"];
        }
        if(json["two_day_add_hr"] is String) {
            twoDayAddHr = json["two_day_add_hr"];
        }
        if(json["two_day_bata"] is String) {
            twoDayBata = json["two_day_bata"];
        }
        if(json["three_day_min_rate"] is String) {
            threeDayMinRate = json["three_day_min_rate"];
        }
        if(json["three_day_included_km"] is String) {
            threeDayIncludedKm = json["three_day_included_km"];
        }
        if(json["three_day_included_hours"] is String) {
            threeDayIncludedHours = json["three_day_included_hours"];
        }
        if(json["three_day_add_km"] is String) {
            threeDayAddKm = json["three_day_add_km"];
        }
        if(json["dinner_rate"] is String) {
            dinnerRate = json["dinner_rate"];
        }
        if(json["lunch_rate"] is String) {
            lunchRate = json["lunch_rate"];
        }
        if(json["breakfast_rate"] is String) {
            breakfastRate = json["breakfast_rate"];
        }
        if(json["extra_hour_rate"] is String) {
            extraHourRate = json["extra_hour_rate"];
        }
        if(json["extra_person_rate"] is String) {
            extraPersonRate = json["extra_person_rate"];
        }
        if(json["three_day_add_hr"] is String) {
            threeDayAddHr = json["three_day_add_hr"];
        }
        if(json["three_day_bata"] is String) {
            threeDayBata = json["three_day_bata"];
        }
        if(json["event_time"] is String) {
            eventTime = json["event_time"];
        }
        if(json["event_date"] is String) {
            eventDate = json["event_date"];
        }
        additionalRateKm = json["additional_rate_km"];
        kmMinRate = json["km_min_rate"];
        if(json["createdAt"] is String) {
            createdAt = json["createdAt"];
        }
        if(json["updatedAt"] is String) {
            updatedAt = json["updatedAt"];
        }
        if(json["propertyImgs"] is List) {
            propertyImgs = json["propertyImgs"] == null ? null : (json["propertyImgs"] as List).map((e) => PropertyImgs.fromJson(e)).toList();
        }
    }

    static List<PropertyVariants> fromList(List<Map<String, dynamic>> list) {
        return list.map(PropertyVariants.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["id"] = id;
        _data["name"] = name;
        _data["rate"] = rate;
        _data["min_rate"] = minRate;
        _data["waiting_rate"] = waitingRate;
        _data["daily_rate"] = dailyRate;
        _data["boat_type"] = boatType;
        _data["percentage"] = percentage;
        if(extraData != null) {
            _data["extraData"] = extraData?.map((e) => e.toJson()).toList();
        }
        if(detailsData != null) {
            _data["detailsData"] = detailsData?.map((e) => e.toJson()).toList();
        }
        _data["tax"] = tax;
        _data["max_person"] = maxPerson;
        _data["child_count"] = childCount;
        _data["total_units_available"] = totalUnitsAvailable;
        _data["person_allowed"] = personAllowed;
        _data["extra_bed_available"] = extraBedAvailable;
        _data["rate_for_extra_bed"] = rateForExtraBed;
        _data["img_url"] = imgUrl;
        _data["capacity"] = capacity;
        _data["staff"] = staff;
        _data["lifeBoys"] = lifeBoys;
        _data["lifeJacket"] = lifeJacket;
        _data["boat_material"] = boatMaterial;
        _data["fire_safety"] = fireSafety;
        _data["emergency_number"] = emergencyNumber;
        _data["capacity_transport"] = capacityTransport;
        _data["vehicle_number"] = vehicleNumber;
        _data["permit_expiry"] = permitExpiry;
        _data["fitness_expiry"] = fitnessExpiry;
        _data["rc_number"] = rcNumber;
        _data["rc_expiry"] = rcExpiry;
        _data["puc_number"] = pucNumber;
        _data["puc_expiry"] = pucExpiry;
        _data["insurance_number"] = insuranceNumber;
        _data["insurance_expiry"] = insuranceExpiry;
        _data["details"] = details;
        _data["fitness_number"] = fitnessNumber;
        _data["permit_number"] = permitNumber;
        _data["one_day_min_rate"] = oneDayMinRate;
        _data["one_day_included_km"] = oneDayIncludedKm;
        _data["one_day_included_hours"] = oneDayIncludedHours;
        _data["one_day_add_km"] = oneDayAddKm;
        _data["one_day_add_hr"] = oneDayAddHr;
        _data["one_day_bata"] = oneDayBata;
        _data["two_day_min_rate"] = twoDayMinRate;
        _data["two_day_included_km"] = twoDayIncludedKm;
        _data["two_day_included_hours"] = twoDayIncludedHours;
        _data["two_day_add_km"] = twoDayAddKm;
        _data["two_day_add_hr"] = twoDayAddHr;
        _data["two_day_bata"] = twoDayBata;
        _data["three_day_min_rate"] = threeDayMinRate;
        _data["three_day_included_km"] = threeDayIncludedKm;
        _data["three_day_included_hours"] = threeDayIncludedHours;
        _data["three_day_add_km"] = threeDayAddKm;
        _data["dinner_rate"] = dinnerRate;
        _data["lunch_rate"] = lunchRate;
        _data["breakfast_rate"] = breakfastRate;
        _data["extra_hour_rate"] = extraHourRate;
        _data["extra_person_rate"] = extraPersonRate;
        _data["three_day_add_hr"] = threeDayAddHr;
        _data["three_day_bata"] = threeDayBata;
        _data["event_time"] = eventTime;
        _data["event_date"] = eventDate;
        _data["additional_rate_km"] = additionalRateKm;
        _data["km_min_rate"] = kmMinRate;
        _data["createdAt"] = createdAt;
        _data["updatedAt"] = updatedAt;
        if(propertyImgs != null) {
            _data["propertyImgs"] = propertyImgs?.map((e) => e.toJson()).toList();
        }
        return _data;
    }
}

class PropertyImgs {
    String? id;
    String? imgUrl;
    String? createdAt;
    String? updatedAt;

    PropertyImgs({this.id, this.imgUrl, this.createdAt, this.updatedAt});

    PropertyImgs.fromJson(Map<String, dynamic> json) {
        if(json["id"] is String) {
            id = json["id"];
        }
        if(json["img_url"] is String) {
            imgUrl = json["img_url"];
        }
        if(json["createdAt"] is String) {
            createdAt = json["createdAt"];
        }
        if(json["updatedAt"] is String) {
            updatedAt = json["updatedAt"];
        }
    }

    static List<PropertyImgs> fromList(List<Map<String, dynamic>> list) {
        return list.map(PropertyImgs.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["id"] = id;
        _data["img_url"] = imgUrl;
        _data["createdAt"] = createdAt;
        _data["updatedAt"] = updatedAt;
        return _data;
    }
}

class DetailsData {
    String? key;
    String? value;
    String? iconUrl;
    String? mainOptions;

    DetailsData({this.key, this.value, this.iconUrl, this.mainOptions});

    DetailsData.fromJson(Map<String, dynamic> json) {
        if(json["key"] is String) {
            key = json["key"];
        }
        if(json["value"] is String) {
            value = json["value"];
        }
        if(json["icon_url"] is String) {
            iconUrl = json["icon_url"];
        }
        if(json["mainOptions"] is String) {
            mainOptions = json["mainOptions"];
        }
    }

    static List<DetailsData> fromList(List<Map<String, dynamic>> list) {
        return list.map(DetailsData.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["key"] = key;
        _data["value"] = value;
        _data["icon_url"] = iconUrl;
        _data["mainOptions"] = mainOptions;
        return _data;
    }
}

class ExtraData {
    String? key;
    bool? value;
    String? iconUrl;
    String? mainOptions;

    ExtraData({this.key, this.value, this.iconUrl, this.mainOptions});

    ExtraData.fromJson(Map<String, dynamic> json) {
        if(json["key"] is String) {
            key = json["key"];
        }
        if(json["value"] is bool) {
            value = json["value"];
        }
        if(json["icon_url"] is String) {
            iconUrl = json["icon_url"];
        }
        if(json["mainOptions"] is String) {
            mainOptions = json["mainOptions"];
        }
    }

    static List<ExtraData> fromList(List<Map<String, dynamic>> list) {
        return list.map(ExtraData.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["key"] = key;
        _data["value"] = value;
        _data["icon_url"] = iconUrl;
        _data["mainOptions"] = mainOptions;
        return _data;
    }
}
