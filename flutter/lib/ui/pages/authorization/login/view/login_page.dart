import 'package:del_boy_app/res/colors.dart';
import 'package:del_boy_app/res/images.dart';
import 'package:del_boy_app/res/style.dart';
import 'package:del_boy_app/ui/pages/authorization/login/bind/login_binding.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';

class LoginPage extends GetView<SignInController> {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primaryColor,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight:
                  MediaQuery.of(context).size.height -
                  MediaQuery.of(context).padding.vertical -
                  32,
            ),
            child: IntrinsicHeight(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      // Icon(Icons.local_shipping, size: 36, color: darkText),
                      // const SizedBox(width: 8),
                      // Text(
                      //   'Driver',
                      //   style: TextStyle(
                      //     fontSize: 32,
                      //     fontWeight: FontWeight.bold,
                      //     color: darkText,
                      //   ),
                      // ),
                      Image.asset(logo,width: 80,height: 80,)
                    ],
                  ),

                  const SizedBox(height: 32),

                  // Headline
                  RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: 'Welcome Back !',
                          style: customStyle(28.0, darkText, FontWeight.bold),
                        ),
                        // TextSpan(
                        //   text: 'TruckD',
                        //   style: customStyle(
                        //     28.0,
                        //     primaryOrange,
                        //     FontWeight.bold,
                        //   ),
                        // ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Please enter your Login details.',
                    style: customStyle(16.0, greyText, FontWeight.normal),
                  ),

                  const SizedBox(height: 32),

                  // Phone input form
                  Form(
                    key: controller.formKey,
                    child: TextFormField(
                      controller: controller.phoneController,
                      keyboardType: TextInputType.number,
                      style: customStyle(16.0, darkText, FontWeight.normal),
                      inputFormatters: [
                        FilteringTextInputFormatter.digitsOnly,
                        LengthLimitingTextInputFormatter(10),
                      ],
                      decoration: InputDecoration(
                        labelText: 'Phone Number',
                        labelStyle: customStyle(
                          16.0,
                          darkText,
                          FontWeight.normal,
                        ),
                        hintText: 'Enter Phone Number',
                        hintStyle: customStyle(
                          16.0,
                          greyText,
                          FontWeight.normal,
                        ),
                        border: OutlineInputBorder(
                          borderSide: BorderSide(color: greyText),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusColor: greyText,
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: darkText),
                          borderRadius: BorderRadius.circular(12),
                        ),

                        suffixIcon: Padding(
                          padding: const EdgeInsets.only(right: 12.0),
                          child: Icon(Icons.phone, color: greyText),
                        ),
                        counterText: '',
                      ),
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) {
                          return 'Required';
                        }
                        if (v.trim().length != 10) {
                          return 'Enter a 10-digit mobile number';
                        }
                        return null;
                      },
                    ),
                  ),

                  Spacer(),

                  // Terms & conditions
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                    child: Text.rich(
                      TextSpan(
                        text: 'By clicking Next, you agree with our ',
                        style: customStyle(12.0, greyText, FontWeight.normal),
                        children: [
                          TextSpan(
                            text: 'Terms and Conditions',
                            style: customStyle(12.0, darkText, FontWeight.bold),
                          ),
                          TextSpan(
                            text: ' and ',
                            style: customStyle(
                              12.0,
                              greyText,
                              FontWeight.normal,
                            ),
                          ),
                          TextSpan(
                            text: 'Privacy Policy',
                            style: customStyle(12.0, darkText, FontWeight.bold),
                          ),
                        ],
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Sign In button
                  SizedBox(
                    height: 56,
                    child: ElevatedButton(
                      onPressed: controller.submit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryOrange,
                        elevation: 6,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      child: Text(
                        'Login',
                        style: customStyle(
                          16.0,
                          Colors.white,
                          FontWeight.normal,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
