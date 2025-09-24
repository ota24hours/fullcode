class LoginModel {
  bool? success;
  String? message;
  String? instance;
  Data? data;

  LoginModel({this.success, this.message, this.instance, this.data});

  LoginModel.fromJson(Map<String, dynamic> json) {
    if (json["success"] is bool) {
      success = json["success"];
    }
    if (json["message"] is String) {
      message = json["message"];
    }
    if (json["instance"] is String) {
      instance = json["instance"];
    }
    if (json["data"] is Map) {
      data = json["data"] == null ? null : Data.fromJson(json["data"]);
    }
  }

  static List<LoginModel> fromList(List<Map<String, dynamic>> list) {
    return list.map(LoginModel.fromJson).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> _data = <String, dynamic>{};
    _data["success"] = success;
    _data["message"] = message;
    _data["instance"] = instance;
    if (data != null) {
      _data["data"] = data?.toJson();
    }
    return _data;
  }
}

class Data {
  String? userTypr;
  String? id;
  dynamic otp;
  String? otpKey;

  Data({this.userTypr, this.id, this.otp, this.otpKey});

  Data.fromJson(Map<String, dynamic> json) {
    if (json["user_typr"] is String) {
      userTypr = json["user_typr"];
    }
    if (json["id"] is String) {
      id = json["id"];
    }
    otp = json["otp"];

    if (json["otpKey"] is String) {
      otpKey = json["otpKey"];
    }
  }

  static List<Data> fromList(List<Map<String, dynamic>> list) {
    return list.map(Data.fromJson).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> _data = <String, dynamic>{};
    _data["user_typr"] = userTypr;
    _data["id"] = id;
    _data["otp"] = otp;
    _data["otpKey"] = otpKey;
    return _data;
  }
}
