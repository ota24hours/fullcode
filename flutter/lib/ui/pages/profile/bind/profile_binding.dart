import 'package:del_boy_app/ui/model/profile_model.dart';
import 'package:del_boy_app/utilities/api_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_custom_utils/util/utils.dart';
import 'package:get/get.dart';

class ProfileBinding implements Bindings {
  @override
  void dependencies() {
    [Get.put(ProfileController())];
  }
}

class ProfileController extends GetxController {
  static ProfileController get to => Get.find();
  final nameCtrl = TextEditingController();
  final phoneCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final secondaryNameCtrl = TextEditingController();
  final secondaryPhoneCtrl = TextEditingController();
  final dobCtrl = TextEditingController();
  final addressCtrl = TextEditingController();
  final ageCtrl = TextEditingController();
  final countryCtrl = TextEditingController();
  final stateCtrl = TextEditingController();
  final districtCtrl = TextEditingController();

  var isEdit = false.obs;

  @override
  void onInit() {
    super.onInit();
    getProfileData();
  }

  bool isFormValid() {
    return phoneCtrl.text.length == 10 &&
        nameCtrl.text.isNotEmpty &&
        addressCtrl.text.isNotEmpty;
  }

  void saveAndSubmit() {
    print("Form submitted");
  }

  ProfileModel? profileModel;

  Future<void> getProfileData() async {
    try {
      profileModel = await Api.to.getProfile();

      if (profileModel?.success ?? false) {
        var data = profileModel?.data;
        nameCtrl.text = data?.name ?? '';
        phoneCtrl.text = data?.phone ?? '';
        emailCtrl.text = data?.email ?? '';
        secondaryNameCtrl.text = data?.secodaryName ?? '';
        secondaryPhoneCtrl.text = data?.secodaryPhone ?? '';
        dobCtrl.text = data?.dateOfBirth ?? '';
        addressCtrl.text = data?.address ?? '';
        ageCtrl.text = data?.age ?? '';
        countryCtrl.text = data?.country ?? 'India';
        stateCtrl.text = data?.state ?? 'Kerala';
        districtCtrl.text = data?.district ?? '';
      }
    } catch (e) {
      cLog('Error fetching profile data: $e');
    } finally {
      update();
    }
  }
}
