import 'dart:io';

import 'package:del_boy_app/res/colors.dart';
import 'package:del_boy_app/res/images.dart';
import 'package:del_boy_app/res/style.dart';
import 'package:del_boy_app/ui/pages/authorization/otp/bind/otp_binding.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

class OtpPage extends GetView<OtpController> {
  const OtpPage({super.key});

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.of(context).size.width;
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, v) {
        if (!didPop) {
          _showExitDialog(context);
        }
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    // Icon(Icons.local_shipping, size: 40),
                    // SizedBox(width: 8),
                    // Text(
                    //   "Driver",
                    //   style: customStyle(34.0, darkText, FontWeight.bold),
                    // ),
                    Image.asset(logo,width: 80,height: 80,)
                  ],
                ),
                const SizedBox(height: 48),
                RichText(
                  text: TextSpan(
                    text: 'Enter ',
                    style: customStyle(26.0, darkText, FontWeight.bold),
                    children: [
                      TextSpan(
                        text: 'OTP',
                        style: customStyle(
                          26.0,
                          primaryOrange,
                          FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                RichText(
                  text: TextSpan(
                    text:
                        "Please enter the 4 digit OTP Code sent on\n${controller.mobileNo}  ",
                    style: customStyle(14.0, greyText, FontWeight.normal),
                    children: [
                      TextSpan(
                        text: 'Change',
                        style: customStyle(
                          12.0,
                          primaryOrange,
                          FontWeight.bold,
                        ),
                        recognizer: TapGestureRecognizer()
                          ..onTap = controller.changeNumber,
                      ),
                    ],
                  ),
                ),
                Text(
                  "Please enter the 4 digit OTP Code sent on\n${controller.mobileNo}",
                  style: customStyle(14.0, greyText, FontWeight.normal),
                ),
                const SizedBox(height: 32),
                // ───── PIN CODE FIELDS ──────────────────────────────
                PinCodeTextField(
                  appContext: context,
                  length: 4,
                  controller: controller.pinController, // ← use our controller
                  autoDisposeControllers: false,
                  keyboardType: TextInputType.number,
                  cursorColor: primaryOrange,
                  textStyle: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                  pinTheme: PinTheme(
                    shape: PinCodeFieldShape.box,
                    borderRadius: BorderRadius.circular(12),
                    fieldHeight: w * 0.18,
                    fieldWidth: w * 0.18,
                    activeColor: primaryOrange,
                    selectedColor: primaryOrange,
                    inactiveColor: Colors.grey,
                    activeFillColor: Colors.white,
                    inactiveFillColor: Colors.white,
                    selectedFillColor: Colors.white,
                    fieldOuterPadding: const EdgeInsets.symmetric(
                      horizontal: 4,
                    ),
                  ),
                  enableActiveFill: true,
                  onChanged: (val) => controller.code.value = val,
                  onCompleted: (val) {
                    Future.delayed(const Duration(seconds: 3), () {
                      controller.postVerifyData();
                    });
                  },
                ),

                const SizedBox(height: 32),

                // … inside your Column, replace the SizedBox/ElevatedButton with:
                Obx(() {
                  final isComplete = controller.code.value.length == 4;
                  return SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: isComplete
                          ? () {
                              controller.postVerifyData();
                            }
                          : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isComplete
                            ? primaryOrange
                            : Colors.grey[400],
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        elevation: isComplete ? 6 : 0,
                      ),
                      child: Text(
                        "NEXT",
                        style: customStyle(
                          18.0,
                          isComplete ? Colors.white : Colors.white70,
                          FontWeight.bold,
                        ),
                      ),
                    ),
                  );
                }),

                const SizedBox(height: 20),
                Center(
                  child: Obx(
                    () => RichText(
                      text: TextSpan(
                        text: "Didn’t receive the code? ",
                        style: customStyle(15.0, darkText, FontWeight.normal),
                        children: [
                          TextSpan(
                            text: controller.timer.value == 0
                                ? "Resend"
                                : "Resend (${controller.timer.value}s)",
                            style: customStyle(
                              15.0,
                              primaryOrange,
                              FontWeight.bold,
                            ),
                            recognizer: TapGestureRecognizer()
                              ..onTap = controller.timer.value == 0
                                  ? controller.resendOtp
                                  : null,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

void _showExitDialog(BuildContext ctx) {
  final cancel = TextButton(
    child: const Text('Cancel'),
    onPressed: () => Get.back(),
  );
  final ok = TextButton(
    child: const Text('Ok'),
    onPressed: () {
      if (Platform.isAndroid) {
        SystemNavigator.pop();
      } else if (Platform.isIOS) {
        exit(0);
      }
    },
  );
  showDialog(
    context: ctx,
    builder: (_) => AlertDialog(
      title: const Text('Are you sure?'),
      content: const Text('Want to close the app?'),
      actions: [cancel, ok],
    ),
  );
}
