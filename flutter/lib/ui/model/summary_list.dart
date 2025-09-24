
class SummaryListModel {
    bool? success;
    String? message;
    String? instance;
    Data? data;

    SummaryListModel({this.success, this.message, this.instance, this.data});

    SummaryListModel.fromJson(Map<String, dynamic> json) {
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

    static List<SummaryListModel> fromList(List<Map<String, dynamic>> list) {
        return list.map(SummaryListModel.fromJson).toList();
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
    String? vendorId;
    Period? period;
    dynamic totalDue;
    dynamic totalPaid;
    dynamic outstanding;
    List<Breakdown>? breakdown;
    List<Payments>? payments;

    Data({this.vendorId, this.period, this.totalDue, this.totalPaid, this.outstanding, this.breakdown, this.payments});

    Data.fromJson(Map<String, dynamic> json) {
        if(json["vendorId"] is String) {
            vendorId = json["vendorId"];
        }
        if(json["period"] is Map) {
            period = json["period"] == null ? null : Period.fromJson(json["period"]);
        }
        // if(json["totalDue"] is int) {
            totalDue = json["totalDue"];
        // }
        // if(json["totalPaid"] is int) {
            totalPaid = json["totalPaid"];
        // }
        // if(json["outstanding"] is int) {
            outstanding = json["outstanding"];
        // }
        if(json["breakdown"] is List) {
            breakdown = json["breakdown"] == null ? null : (json["breakdown"] as List).map((e) => Breakdown.fromJson(e)).toList();
        }
        if(json["payments"] is List) {
            payments = json["payments"] == null ? null : (json["payments"] as List).map((e) => Payments.fromJson(e)).toList();
        }
    }

    static List<Data> fromList(List<Map<String, dynamic>> list) {
        return list.map(Data.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["vendorId"] = vendorId;
        if(period != null) {
            _data["period"] = period?.toJson();
        }
        _data["totalDue"] = totalDue;
        _data["totalPaid"] = totalPaid;
        _data["outstanding"] = outstanding;
        if(breakdown != null) {
            _data["breakdown"] = breakdown?.map((e) => e.toJson()).toList();
        }
        if(payments != null) {
            _data["payments"] = payments?.map((e) => e.toJson()).toList();
        }
        return _data;
    }
}

class Payments {
    String? id;
    String? amount;
    String? note;
    String? createdAt;
    String? updatedAt;

    Payments({this.id, this.amount, this.note, this.createdAt, this.updatedAt});

    Payments.fromJson(Map<String, dynamic> json) {
        if(json["id"] is String) {
            id = json["id"];
        }
        if(json["amount"] is String) {
            amount = json["amount"];
        }
        if(json["note"] is String) {
            note = json["note"];
        }
        if(json["createdAt"] is String) {
            createdAt = json["createdAt"];
        }
        if(json["updatedAt"] is String) {
            updatedAt = json["updatedAt"];
        }
    }

    static List<Payments> fromList(List<Map<String, dynamic>> list) {
        return list.map(Payments.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["id"] = id;
        _data["amount"] = amount;
        _data["note"] = note;
        _data["createdAt"] = createdAt;
        _data["updatedAt"] = updatedAt;
        return _data;
    }
}

class Breakdown {
    String? bookingId;
    int? share;
    String? bookingDate;
    User? user;

    Breakdown({this.bookingId, this.share, this.bookingDate, this.user});

    Breakdown.fromJson(Map<String, dynamic> json) {
        if(json["bookingId"] is String) {
            bookingId = json["bookingId"];
        }
        if(json["share"] is int) {
            share = json["share"];
        }
        if(json["bookingDate"] is String) {
            bookingDate = json["bookingDate"];
        }
        if(json["user"] is Map) {
            user = json["user"] == null ? null : User.fromJson(json["user"]);
        }
    }

    static List<Breakdown> fromList(List<Map<String, dynamic>> list) {
        return list.map(Breakdown.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["bookingId"] = bookingId;
        _data["share"] = share;
        _data["bookingDate"] = bookingDate;
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
    String? secondaryName;
    String? secondaryPhone;
    String? email;

    User({this.id, this.name, this.phone, this.secondaryName, this.secondaryPhone, this.email});

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
        if(json["secondary_name"] is String) {
            secondaryName = json["secondary_name"];
        }
        if(json["secondary_phone"] is String) {
            secondaryPhone = json["secondary_phone"];
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
        _data["secondary_name"] = secondaryName;
        _data["secondary_phone"] = secondaryPhone;
        _data["email"] = email;
        return _data;
    }
}

class Period {
    dynamic startDate;
    dynamic endDate;

    Period({this.startDate, this.endDate});

    Period.fromJson(Map<String, dynamic> json) {
        startDate = json["startDate"];
        endDate = json["endDate"];
    }

    static List<Period> fromList(List<Map<String, dynamic>> list) {
        return list.map(Period.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["startDate"] = startDate;
        _data["endDate"] = endDate;
        return _data;
    }
}