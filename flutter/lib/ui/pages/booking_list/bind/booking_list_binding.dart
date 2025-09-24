import 'package:del_boy_app/ui/model/boocking_list_model.dart';
import 'package:del_boy_app/utilities/api_provider.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';

class BookingBinding implements Bindings {
  @override
  void dependencies() {
    // lazyPut so controller is only created when BookingPage is shown
    Get.lazyPut<BookingController>(() => BookingController());
  }
}

class BookingController extends GetxController {
  static BookingController get to => Get.find();
  // Reactive state
  final bookings = <Bookings>[].obs;
  final page = 1.obs;
  final limit = 20.obs;
  final total = 0.obs;
  final isFirstLoading = true.obs;
  final isLoadingMore = false.obs;
  final pageTitle = 'Bookings'.obs;

  @override
  void onInit() {
    super.onInit();
    _fetchPage(isMore: false);
  }

  /// Returns true if there are more pages to load.
  bool get hasMore => bookings.length < total.value;

  /// Core fetch logic.
  /// If [isMore] is true, appends; otherwise replaces.
  Future<void> _fetchPage({required bool isMore}) async {
    if (isMore) {
      isLoadingMore.value = true;
      page.value++;
    } else {
      page.value = 1;
      bookings.clear();
      isFirstLoading.value = true;
    }

    try {
      EasyLoading.show();
      final model = await Api.to.getBooking(page: page.value.toString());
      total.value = model.data?.total ?? total.value;
      limit.value = model.data?.limit ?? limit.value;

      final newItems = model.data?.bookings ?? [];
      if (isMore) {
        bookings.addAll(newItems);
      } else {
        bookings.assignAll(newItems);
      }
    } finally {
      EasyLoading.dismiss();
      if (isMore) {
        isLoadingMore.value = false;
      } else {
        isFirstLoading.value = false;
      }
    }
  }

  @override
  void onClose() {
    super.onClose();
    bookings.value = <Bookings>[];
    page.value = 1;
    limit.value = 20;
    total.value = 0;
    isFirstLoading.value = true;
    isLoadingMore.value = false;
    pageTitle.value = 'Bookings';
  }

  /// Public trigger for loading the next page.
  void fetchMore() {
    if (hasMore && !isLoadingMore.value) {
      // Defer to next frame to avoid “build during build” errors.
      Future.microtask(() => _fetchPage(isMore: true));
    }
  }
}
