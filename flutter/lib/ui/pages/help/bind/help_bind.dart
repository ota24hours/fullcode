
import 'package:get/get.dart';

class HelpBinding implements Bindings {
  @override
  void dependencies() {
    Get.put(HelpController());
  }
}

class HelpController extends GetxController {
  static HelpController get to => Get.find();
  

}
