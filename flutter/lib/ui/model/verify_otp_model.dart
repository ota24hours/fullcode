
class VerifyModelClass {
    bool? success;
    String? message;
    String? instance;
    Data? data;

    VerifyModelClass({this.success, this.message, this.instance, this.data});

    VerifyModelClass.fromJson(Map<String, dynamic> json) {
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

    static List<VerifyModelClass> fromList(List<Map<String, dynamic>> list) {
        return list.map(VerifyModelClass.fromJson).toList();
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
    String? userId;
    String? key;
    String? message;

    Data({this.userId, this.key, this.message});

    Data.fromJson(Map<String, dynamic> json) {
        if(json["user_id"] is String) {
            userId = json["user_id"];
        }
        if(json["key"] is String) {
            key = json["key"];
        }
        if(json["message"] is String) {
            message = json["message"];
        }
    }

    static List<Data> fromList(List<Map<String, dynamic>> list) {
        return list.map(Data.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["user_id"] = userId;
        _data["key"] = key;
        _data["message"] = message;
        return _data;
    }
}