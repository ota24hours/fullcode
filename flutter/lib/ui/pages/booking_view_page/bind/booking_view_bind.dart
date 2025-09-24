import 'package:del_boy_app/ui/model/booking_view_model.dart';
import 'package:del_boy_app/ui/model/status_change_model.dart';
import 'package:del_boy_app/utilities/api_provider.dart';
import 'package:del_boy_app/utilities/common_utilities.dart';
import 'package:flutter_custom_utils/util/utils.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';

class BookingViewBinding implements Bindings {
  @override
  void dependencies() {
    Get.put(BookingViewController());
  }
}

class BookingViewController extends GetxController {
  var totalAmount = 15000.obs;
  var cashCollection = 800.obs;
  var onlinePayment = 800.obs;
  var commission = 200.obs;
  var convenienceFee = 40.obs;
  var yourEarnings = 1200.obs;
  var selectedFilter = 'Monthly'.obs;
  var id = ''.obs;

  List<String> filterOptions = ['Daily', 'Weekly', 'Monthly'];
  @override
  void onInit() {
    super.onInit();
    if (Get.arguments != null) {
      id.value = Get.arguments[0];
      getData();
    }
  }

  BookingViewModel? bookingViewModel;
  void getData() async {
    EasyLoading.show();
    bookingViewModel = await Api.to.getBookingView(id: id.value);
    EasyLoading.dismiss();
    if ((bookingViewModel?.success ?? true)) {}
    update();
  }

  final MapService _mapService = MapService();

  void onTapNavigate(double lat, double lng) {
    _mapService.redirectToMap(latitude: lat, longitude: lng);
  }

  StatusChangeModel? statusChangeModel;
  Future<void> changeStatus(var status) async {
    try {
      EasyLoading.show();
      statusChangeModel = await Api.to.statusChange(
        id: id.value,
        status: status,
      );
      if (statusChangeModel?.success ?? true) {
        getData();
      } else {
        EasyLoading.showToast(statusChangeModel?.message ?? '');
      }
    } catch (e) {
      cLog('Exception in changeStatus: $e');
      // Handle exception appropriately
    } finally {
      EasyLoading.dismiss();
      update();
    }
  }
}
