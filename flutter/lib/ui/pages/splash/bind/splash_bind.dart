import 'package:del_boy_app/utilities/app_routes.dart';
import 'package:del_boy_app/utilities/com_binding.dart';
import 'package:del_boy_app/utilities/strings.dart';
import 'package:flutter_custom_utils/flutter_custom_utils.dart';
import 'package:get/get.dart';

class SplashBinding implements Bindings {
  @override
  void dependencies() {
    Get.put(SplashController());
  }
}

class SplashController extends GetxController {
  static SplashController get to => Get.find();
  @override
  void dispose() {
    SplashController.to.dispose();
    super.dispose();
  }

  @override
  void onInit() {
    super.onInit();
    5.cDelay(() {
      cLog('${AppSession.to.session.read(SessionKeys.API_KEY)}');
      if (AppSession.to.session.read(SessionKeys.API_KEY) != null) {
        Get.offAllNamed(Routes.home);
      } else {
        Get.offAllNamed(Routes.login);
      }
    });
  }
}
