import 'dart:async';

import 'package:del_boy_app/ui/model/login_model.dart';
import 'package:del_boy_app/utilities/api_provider.dart';
import 'package:del_boy_app/utilities/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';

class LoginBinding implements Bindings {
  @override
  void dependencies() {
    [Get.put(SignInController())];
  }
}

class SignInController extends GetxController {
  LoginModel? loginModel;
  final phoneController = TextEditingController();
  final formKey = GlobalKey<FormState>();

  // You could use an RxString if you want to react to phone changes:
  // final phone = ''.obs;

  @override
  void onClose() {
    phoneController.dispose();
    super.onClose();
  }

  Future<void> submit() async {
    if (!(formKey.currentState?.validate() ?? false)) return;

    final phone = phoneController.text.trim();
    EasyLoading.show(status: 'loading...');

    try {
      // Attempt login, but throw if it takes longer than 10s
      loginModel = await Api.to
          .login(mob: phone)
          .timeout(
            const Duration(seconds: 10),
            onTimeout: () {
              throw TimeoutException('Login request timed out');
            },
          );

      // If we get here, loginModel is non-null and we got a response within 10s
      EasyLoading.dismiss();

      if (loginModel?.success ?? false) {
        Get.snackbar(
          'Login',
          'Sending OTP to $phone',
          snackPosition: SnackPosition.TOP,
        );

        if ((loginModel?.data?.userTypr ?? '') == 'vendor') {
          Get.toNamed(
            Routes.otp,
            arguments: [
              phone,
              loginModel?.data?.otp ?? '',
              loginModel?.data?.otpKey ?? '',
            ],
          );
          phoneController.clear();
        } else {
          Get.snackbar(
            'Invalid login attempt.',
            'Access is allowed for vendors only.',
            snackPosition: SnackPosition.TOP,
            colorText: Colors.red,
          );
        }
      } else {
        Get.snackbar(
          'Login Error',
          'Error: ${loginModel?.message ?? 'Unknown error'}',
          snackPosition: SnackPosition.TOP,
          colorText: Colors.red,
        );
      }
    } on TimeoutException catch (_) {
      // Handle the case where login() took >10s
      EasyLoading.dismiss();
      Get.snackbar(
        'Timeout',
        'The login request took too long. Please check your connection and try again.',
        snackPosition: SnackPosition.TOP,
        colorText: Colors.red,
      );
    } catch (err) {
      // Any other errors (e.g. network down, parsing)
      EasyLoading.dismiss();
      Get.snackbar(
        'Network Error',
        err.toString(),
        snackPosition: SnackPosition.TOP,
        colorText: Colors.red,
      );
    }
  }
}
