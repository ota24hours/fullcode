
import 'package:get/get.dart';

class AboutBinding implements Bindings {
  @override
  void dependencies() {
    Get.put(AboutController());
  }
}

class AboutController extends GetxController {
  static AboutController get to => Get.find();
  

}
