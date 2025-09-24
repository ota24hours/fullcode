
class ProfileModel {
    bool? success;
    String? message;
    String? instance;
    Data? data;

    ProfileModel({this.success, this.message, this.instance, this.data});

    ProfileModel.fromJson(Map<String, dynamic> json) {
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

    static List<ProfileModel> fromList(List<Map<String, dynamic>> list) {
        return list.map(ProfileModel.fromJson).toList();
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
    String? name;
    String? phone;
    String? secodaryName;
    String? secodaryPhone;
    String? email;
    dynamic bankName;
    dynamic branchName;
    dynamic ifsc;
    dynamic acntNmbr;
    dynamic code;
    bool? status;
    dynamic age;
    bool? verified;
    String? verifiedBy;
    String? verifiedAt;
    String? verifiedStatus;
    String? userType;
    String? pincode;
    dynamic thaluk;
    String? district;
    String? state;
    String? country;
    dynamic profileUrl;
    String? address;
    String? gender;
    dynamic dateOfBirth;
    String? gst;
    bool? activeStatus;
    String? createdAt;
    String? updatedAt;
    List<UserSupportDocs>? userSupportDocs;

    Data({this.id, this.name, this.phone, this.secodaryName, this.secodaryPhone, this.email, this.bankName, this.branchName, this.ifsc, this.acntNmbr, this.code, this.status, this.age, this.verified, this.verifiedBy, this.verifiedAt, this.verifiedStatus, this.userType, this.pincode, this.thaluk, this.district, this.state, this.country, this.profileUrl, this.address, this.gender, this.dateOfBirth, this.gst, this.activeStatus, this.createdAt, this.updatedAt, this.userSupportDocs});

    Data.fromJson(Map<String, dynamic> json) {
        if(json["id"] is String) {
            id = json["id"];
        }
        if(json["name"] is String) {
            name = json["name"];
        }
        if(json["phone"] is String) {
            phone = json["phone"];
        }
        if(json["secodary_name"] is String) {
            secodaryName = json["secodary_name"];
        }
        if(json["secodary_phone"] is String) {
            secodaryPhone = json["secodary_phone"];
        }
        if(json["email"] is String) {
            email = json["email"];
        }
        bankName = json["bank_name"];
        branchName = json["branch_name"];
        ifsc = json["ifsc"];
        acntNmbr = json["acnt_nmbr"];
        code = json["code"];
        if(json["status"] is bool) {
            status = json["status"];
        }
        age = json["age"];
        if(json["verified"] is bool) {
            verified = json["verified"];
        }
        if(json["verified_by"] is String) {
            verifiedBy = json["verified_by"];
        }
        if(json["verified_at"] is String) {
            verifiedAt = json["verified_at"];
        }
        if(json["verified_status"] is String) {
            verifiedStatus = json["verified_status"];
        }
        if(json["user_type"] is String) {
            userType = json["user_type"];
        }
        if(json["pincode"] is String) {
            pincode = json["pincode"];
        }
        thaluk = json["thaluk"];
        if(json["district"] is String) {
            district = json["district"];
        }
        if(json["state"] is String) {
            state = json["state"];
        }
        if(json["country"] is String) {
            country = json["country"];
        }
        profileUrl = json["profile_url"];
        if(json["address"] is String) {
            address = json["address"];
        }
        if(json["gender"] is String) {
            gender = json["gender"];
        }
        dateOfBirth = json["date_of_birth"];
        if(json["gst"] is String) {
            gst = json["gst"];
        }
        if(json["active_status"] is bool) {
            activeStatus = json["active_status"];
        }
        if(json["createdAt"] is String) {
            createdAt = json["createdAt"];
        }
        if(json["updatedAt"] is String) {
            updatedAt = json["updatedAt"];
        }
        if(json["user_support_docs"] is List) {
            userSupportDocs = json["user_support_docs"] == null ? null : (json["user_support_docs"] as List).map((e) => UserSupportDocs.fromJson(e)).toList();
        }
    }

    static List<Data> fromList(List<Map<String, dynamic>> list) {
        return list.map(Data.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["id"] = id;
        _data["name"] = name;
        _data["phone"] = phone;
        _data["secodary_name"] = secodaryName;
        _data["secodary_phone"] = secodaryPhone;
        _data["email"] = email;
        _data["bank_name"] = bankName;
        _data["branch_name"] = branchName;
        _data["ifsc"] = ifsc;
        _data["acnt_nmbr"] = acntNmbr;
        _data["code"] = code;
        _data["status"] = status;
        _data["age"] = age;
        _data["verified"] = verified;
        _data["verified_by"] = verifiedBy;
        _data["verified_at"] = verifiedAt;
        _data["verified_status"] = verifiedStatus;
        _data["user_type"] = userType;
        _data["pincode"] = pincode;
        _data["thaluk"] = thaluk;
        _data["district"] = district;
        _data["state"] = state;
        _data["country"] = country;
        _data["profile_url"] = profileUrl;
        _data["address"] = address;
        _data["gender"] = gender;
        _data["date_of_birth"] = dateOfBirth;
        _data["gst"] = gst;
        _data["active_status"] = activeStatus;
        _data["createdAt"] = createdAt;
        _data["updatedAt"] = updatedAt;
        if(userSupportDocs != null) {
            _data["user_support_docs"] = userSupportDocs?.map((e) => e.toJson()).toList();
        }
        return _data;
    }
}

class UserSupportDocs {
    String? id;
    String? docType;
    String? docOne;
    dynamic expiryDate;
    String? createdAt;
    String? updatedAt;

    UserSupportDocs({this.id, this.docType, this.docOne, this.expiryDate, this.createdAt, this.updatedAt});

    UserSupportDocs.fromJson(Map<String, dynamic> json) {
        if(json["id"] is String) {
            id = json["id"];
        }
        if(json["doc_type"] is String) {
            docType = json["doc_type"];
        }
        if(json["doc_one"] is String) {
            docOne = json["doc_one"];
        }
        expiryDate = json["expiry_date"];
        if(json["createdAt"] is String) {
            createdAt = json["createdAt"];
        }
        if(json["updatedAt"] is String) {
            updatedAt = json["updatedAt"];
        }
    }

    static List<UserSupportDocs> fromList(List<Map<String, dynamic>> list) {
        return list.map(UserSupportDocs.fromJson).toList();
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["id"] = id;
        _data["doc_type"] = docType;
        _data["doc_one"] = docOne;
        _data["expiry_date"] = expiryDate;
        _data["createdAt"] = createdAt;
        _data["updatedAt"] = updatedAt;
        return _data;
    }
}