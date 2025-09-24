import 'dart:async';
import 'package:del_boy_app/ui/model/login_model.dart';
import 'package:del_boy_app/ui/model/verify_otp_model.dart';
import 'package:del_boy_app/utilities/api_provider.dart';
import 'package:del_boy_app/utilities/app_routes.dart';
import 'package:del_boy_app/utilities/com_binding.dart';
import 'package:del_boy_app/utilities/strings.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_custom_utils/util/utils.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';

class OtpBinding implements Bindings {
  @override
  void dependencies() {
    [Get.put(OtpController())];
  }
}

class OtpController extends GetxController {
  VerifyModelClass? verifyModelClass;
  LoginModel? loginModel;
  var code = ''.obs;
  var mobileNo = ''.obs;
  var otpKeys = ''.obs;

  /// resend timer
  final timer = 30.obs;
  Timer? _ticker;

  /// controller for the PIN text field
  final TextEditingController pinController = TextEditingController();

  @override
  void onInit() {
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.landscapeRight,
      DeviceOrientation.landscapeLeft,
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);
    super.onInit();
    _startTimer();
    var data = Get.arguments;
    if (data != null) {
      otpKeys.value = data[2].toString();
      mobileNo.value = data[0].toString();
    }

    // ─── auto-fill after 5 seconds ─────────────────────
    Future.delayed(const Duration(seconds: 2), () {
      if (data != null) {
        pinController.text = data[1].toString();
        code.value = data[1].toString();
      }
    });
  }

  void _startTimer() {
    timer.value = 30;
    _ticker?.cancel();
    _ticker = Timer.periodic(const Duration(seconds: 1), (t) {
      if (timer.value == 0) {
        t.cancel();
      } else {
        timer.value--;
      }
    });
  }

  void changeNumber() {
    Get.offAllNamed(Routes.login);
  }

  @override
  void onClose() {
    _ticker?.cancel();
    pinController.dispose();
    super.onClose();
  }

  void postVerifyData() async {
    EasyLoading.show(status: 'loading...');

    verifyModelClass = await Api.to.verifyOtp(
      otpKey: otpKeys.value,
      otp: code.value,
    );
    EasyLoading.dismiss();
    cLog('Data =${verifyModelClass?.data?.key ?? ''}');
    if (verifyModelClass?.success ?? false) {
      AppSession.to.session.write(
        SessionKeys.API_KEY,
        verifyModelClass?.data?.key ?? '',
      );
      Get.offAllNamed(Routes.home);
    } else {
      Get.snackbar(
        'Verification Error',
        colorText: Colors.red,
        'Error :- ${verifyModelClass?.message ?? ''}',
        snackPosition: SnackPosition.TOP,
      );
    }
  }

  void resendOtp() async {
    EasyLoading.show(status: 'loading...');
    loginModel = await Api.to.login(mob: mobileNo.value);
    EasyLoading.dismiss();

    if (loginModel?.success ?? true) {
      _startTimer();
      otpKeys.value = loginModel?.data?.otpKey?.toString() ?? '';
      Future.delayed(const Duration(seconds: 2), () {
        code.value = loginModel?.data?.otp?.toString() ?? '';
        pinController.text = loginModel?.data?.otp?.toString() ?? '';
      });
    } else {
      Get.snackbar(
        'Verification Error',
        colorText: Colors.red,
        'Error :- ${loginModel?.message ?? ''}',
        snackPosition: SnackPosition.TOP,
      );
    }
  }
}
