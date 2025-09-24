import 'package:del_boy_app/utilities/api_provider.dart';
import 'package:del_boy_app/utilities/app_routes.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class ComBinding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => Api(), fenix: true);
    Get.put(AppSession());
  }
}

class AppSession extends GetxController {
  static AppSession get to => Get.find();
  var session = GetStorage('Del_Boy');

  void logout() {
    AppSession.to.session.erase();
    Get.offNamed(Routes.splash);
  }
}
