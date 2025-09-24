
class StatusChangeModel {
    bool? success;
    String? message;
    String? instance;
    Data? data;

    StatusChangeModel({this.success, this.message, this.instance, this.data});

    StatusChangeModel.fromJson(Map<String, dynamic> json) {
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

    static List<StatusChangeModel> fromList(List<Map<String, dynamic>> list) {
        return list.map(StatusChangeModel.fromJson).toList();
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

    Data({this.id, this.startDate, this.endDate, this.unitsBooked, this.baseAmount, this.taxAmount, this.extrasAmount, this.totalAmount, this.paymentType, this.status, this.paymentGatewayId, this.paymentOrderId, this.createdAt, this.updatedAt});

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
        return _data;
    }
}