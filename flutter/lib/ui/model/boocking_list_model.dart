
class BookingListModel {
    bool? success;
    String? message;
    String? instance;
    Data? data;

    BookingListModel({this.success, this.message, this.instance, this.data});

    BookingListModel.fromJson(Map<String, dynamic> json) {
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

    static List<BookingListModel> fromList(List<Map<String, dynamic>> list) {
        return list.map(BookingListModel.fromJson).toList();
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
    List<Bookings>? bookings;
    int? total;
    int? limit;

    Data({this.bookings, this.total, this.limit});

    Data.fromJson(Map<String, dynamic> json) {
        if(json["bookings"] is List) {
            bookings = json["bookings"] == null ? null : (json["bookings"] as List).map((e) => Bookings.fromJson(e)).toList();
        }
        if(json["total"] is int) {
            total = json["total"];
        }
        if(json["limit"] is int) {
            limit = json["limit"];
        }
    }

    static List<Data> fromList(List<Map<String, dynamic>> list) {
        return list.map(Data.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        if(bookings != null) {
            _data["bookings"] = bookings?.map((e) => e.toJson()).toList();
        }
        _data["total"] = total;
        _data["limit"] = limit;
        return _data;
    }
}

class Bookings {
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

    Bookings({this.id, this.startDate, this.endDate, this.unitsBooked, this.baseAmount, this.taxAmount, this.extrasAmount, this.totalAmount, this.paymentType, this.status, this.paymentGatewayId, this.paymentOrderId, this.createdAt, this.updatedAt, this.property, this.variant, this.user});

    Bookings.fromJson(Map<String, dynamic> json) {
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

    static List<Bookings> fromList(List<Map<String, dynamic>> list) {
        return list.map(Bookings.fromJson).toList();
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
    List<ExtraData1>? extraData;
    String? tax;
    String? maxPerson;
    dynamic childCount;
    String? totalUnitsAvailable;
    String? personAllowed;
    bool? extraBedAvailable;
    String? rateForExtraBed;
    String? imgUrl;
    String? createdAt;
    String? updatedAt;

    Variant({this.id, this.name, this.rate, this.minRate, this.waitingRate, this.dailyRate, this.extraData, this.tax, this.maxPerson, this.childCount, this.totalUnitsAvailable, this.personAllowed, this.extraBedAvailable, this.rateForExtraBed, this.imgUrl, this.createdAt, this.updatedAt});

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
        if(json["extraData"] is List) {
            extraData = json["extraData"] == null ? null : (json["extraData"] as List).map((e) => ExtraData1.fromJson(e)).toList();
        }
        if(json["tax"] is String) {
            tax = json["tax"];
        }
        if(json["max_person"] is String) {
            maxPerson = json["max_person"];
        }
        childCount = json["child_count"];
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
        if(extraData != null) {
            _data["extraData"] = extraData?.map((e) => e.toJson()).toList();
        }
        _data["tax"] = tax;
        _data["max_person"] = maxPerson;
        _data["child_count"] = childCount;
        _data["total_units_available"] = totalUnitsAvailable;
        _data["person_allowed"] = personAllowed;
        _data["extra_bed_available"] = extraBedAvailable;
        _data["rate_for_extra_bed"] = rateForExtraBed;
        _data["img_url"] = imgUrl;
        _data["createdAt"] = createdAt;
        _data["updatedAt"] = updatedAt;
        return _data;
    }
}

class ExtraData1 {
    String? key;
    String? value;
    String? iconUrl;
    String? mainOptions;

    ExtraData1({this.key, this.value, this.iconUrl, this.mainOptions});

    ExtraData1.fromJson(Map<String, dynamic> json) {
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
    String? name;
    String? image;
    String? description;
    String? rate;
    String? percentage;
    String? latitude;
    String? longitude;
    int? totalUnits;
    bool? isActive;
    int? capacity;
    dynamic make;
    dynamic model;
    dynamic registrationNumber;
    dynamic transmission;
    dynamic roomNumber;
    dynamic bedCount;
    dynamic amenities;
    bool? hasBreakfastIncluded;
    String? boatName;
    String? boatRegistrationNo;
    bool? hasDiningFacility;
    dynamic eventStartDate;
    dynamic eventEndDate;
    dynamic eventLocation;
    String? createdAt;
    String? updatedAt;
    List<PropertyVariants>? propertyVariants;
    List<dynamic>? propertyImgs;

    Property({this.id, this.propertyType, this.name, this.image, this.description, this.rate, this.percentage, this.latitude, this.longitude, this.totalUnits, this.isActive, this.capacity, this.make, this.model, this.registrationNumber, this.transmission, this.roomNumber, this.bedCount, this.amenities, this.hasBreakfastIncluded, this.boatName, this.boatRegistrationNo, this.hasDiningFacility, this.eventStartDate, this.eventEndDate, this.eventLocation, this.createdAt, this.updatedAt, this.propertyVariants, this.propertyImgs});

    Property.fromJson(Map<String, dynamic> json) {
        if(json["id"] is String) {
            id = json["id"];
        }
        if(json["propertyType"] is String) {
            propertyType = json["propertyType"];
        }
        if(json["name"] is String) {
            name = json["name"];
        }
        if(json["image"] is String) {
            image = json["image"];
        }
        if(json["description"] is String) {
            description = json["description"];
        }
        if(json["rate"] is String) {
            rate = json["rate"];
        }
        if(json["percentage"] is String) {
            percentage = json["percentage"];
        }
        if(json["latitude"] is String) {
            latitude = json["latitude"];
        }
        if(json["longitude"] is String) {
            longitude = json["longitude"];
        }
        if(json["totalUnits"] is int) {
            totalUnits = json["totalUnits"];
        }
        if(json["isActive"] is bool) {
            isActive = json["isActive"];
        }
        if(json["capacity"] is int) {
            capacity = json["capacity"];
        }
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
        if(json["boatName"] is String) {
            boatName = json["boatName"];
        }
        if(json["boatRegistrationNo"] is String) {
            boatRegistrationNo = json["boatRegistrationNo"];
        }
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
        if(json["propertyImgs"] is List) {
            propertyImgs = json["propertyImgs"] ?? [];
        }
    }

    static List<Property> fromList(List<Map<String, dynamic>> list) {
        return list.map(Property.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["id"] = id;
        _data["propertyType"] = propertyType;
        _data["name"] = name;
        _data["image"] = image;
        _data["description"] = description;
        _data["rate"] = rate;
        _data["percentage"] = percentage;
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
        if(propertyImgs != null) {
            _data["propertyImgs"] = propertyImgs;
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
    List<ExtraData>? extraData;
    String? tax;
    String? maxPerson;
    dynamic childCount;
    String? totalUnitsAvailable;
    String? personAllowed;
    bool? extraBedAvailable;
    String? rateForExtraBed;
    String? imgUrl;
    String? createdAt;
    String? updatedAt;

    PropertyVariants({this.id, this.name, this.rate, this.minRate, this.waitingRate, this.dailyRate, this.extraData, this.tax, this.maxPerson, this.childCount, this.totalUnitsAvailable, this.personAllowed, this.extraBedAvailable, this.rateForExtraBed, this.imgUrl, this.createdAt, this.updatedAt});

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
        if(json["extraData"] is List) {
            extraData = json["extraData"] == null ? null : (json["extraData"] as List).map((e) => ExtraData.fromJson(e)).toList();
        }
        if(json["tax"] is String) {
            tax = json["tax"];
        }
        if(json["max_person"] is String) {
            maxPerson = json["max_person"];
        }
        childCount = json["child_count"];
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
        if(json["createdAt"] is String) {
            createdAt = json["createdAt"];
        }
        if(json["updatedAt"] is String) {
            updatedAt = json["updatedAt"];
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
        if(extraData != null) {
            _data["extraData"] = extraData?.map((e) => e.toJson()).toList();
        }
        _data["tax"] = tax;
        _data["max_person"] = maxPerson;
        _data["child_count"] = childCount;
        _data["total_units_available"] = totalUnitsAvailable;
        _data["person_allowed"] = personAllowed;
        _data["extra_bed_available"] = extraBedAvailable;
        _data["rate_for_extra_bed"] = rateForExtraBed;
        _data["img_url"] = imgUrl;
        _data["createdAt"] = createdAt;
        _data["updatedAt"] = updatedAt;
        return _data;
    }
}

class ExtraData {
    String? key;
    String? value;
    String? iconUrl;
    String? mainOptions;

    ExtraData({this.key, this.value, this.iconUrl, this.mainOptions});

    ExtraData.fromJson(Map<String, dynamic> json) {
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