class BaseModelClass {
  bool? error;
  String? message;
  String? instance;

  BaseModelClass({this.error, this.message, this.instance});

  BaseModelClass.fromJson(Map<String, dynamic> json) {
    error = json['error'];
    message = json['message'];
    instance = json['instance'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['error'] = error;
    data['message'] = message;
    data['instance'] = instance;
    return data;
  }
}
