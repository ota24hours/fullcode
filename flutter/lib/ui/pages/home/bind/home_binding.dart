import 'dart:io';
import 'package:del_boy_app/ui/model/base_model.dart';
import 'package:del_boy_app/ui/pages/home/view/home_page.dart';
import 'package:del_boy_app/utilities/com_binding.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_custom_utils/util/utils.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:del_boy_app/ui/model/profile_model.dart';
import 'package:del_boy_app/ui/pages/profile/bind/profile_binding.dart';
import 'package:del_boy_app/utilities/api_provider.dart';
import 'package:del_boy_app/utilities/app_routes.dart';

// Binding
class HomeBinding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<HomeController>(() => HomeController());
    Get.lazyPut<ProfileController>(() => ProfileController());
  }
}

// Controller
class HomeController extends GetxController {
  static HomeController get to => Get.find();

  final Rxn<ProfileModel> profile = Rxn<ProfileModel>();
  final RxBool isOnline = true.obs;
  final RxInt selectedIndex = 0.obs;
  final RxString currentAddress = 'Fetching location...'.obs;

  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      getProfile();
      _loadLocation();
    });
  }

  Future<void> getProfile() async {
    try {
      final result = await Api.to.getProfile();
      if ((result.success ?? false)) {
        profile.value = result;
      } else {
        debugPrint('Profile fetch returned null or unsuccessful');
      }
    } catch (e) {
      debugPrint('Profile fetch error: $e');
    } finally {
      update();
    }
  }

  Future<void> _loadLocation() async {
    try {
      // 1. Ensure location service is enabled
      if (!await Geolocator.isLocationServiceEnabled()) {
        currentAddress.value = 'Location service disabled';
        update();
        return;
      }

      // 2. Check / request permission
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        currentAddress.value = 'Location permission denied';
        update();
        return;
      }

      // 3. Fetch latitude & longitude
      final Position pos = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      final double lat = pos.latitude;
      final double long = pos.longitude;

      // 4. Update server with current latitude and longitude
      //    Replace updateLocation with your API method name and parameters
      try {
        // await Api.to.postUserLocation(lat: lat, long: long);
        debugPrint('Location sent to server: latitude=\$lat, longitude=\$long');
      } catch (apiError) {
        debugPrint('Failed to update location: \$apiError');
      }

      // 5. Reverse-geocode for display purposes
      final places = await placemarkFromCoordinates(lat, long);
      if (places.isNotEmpty) {
        final p = places.first;
        currentAddress.value = '${p.locality}, ${p.country}';
      } else {
        currentAddress.value =
            '${lat.toStringAsFixed(5)}, ${long.toStringAsFixed(5)}';
      }
    } catch (e) {
      currentAddress.value = '--';
      debugPrint('Location error: \$e');
    } finally {
      update();
    }
  }

  void onNavTap(int index) {
    selectedIndex.value = index;
    if (index == 1) {
      Get.find<ProfileController>().onInit();
    }
  }

  void exitApp() {
    if (Platform.isAndroid) {
      SystemNavigator.pop();
    } else {
      exit(0);
    }
  }

  BaseModelClass? baseModelClass;
  Future<void> changeStatus(bool status) async {
    try {
      EasyLoading.show();
      baseModelClass = await Api.to.changeStatus(status: status);
      if (baseModelClass?.error ?? true) {
        EasyLoading.showToast(baseModelClass?.message ?? '');
      } else {
        
      }
    } catch (e) {
      cLog('Exception in changeStatus: $e');
      // Handle exception appropriately
    } finally {
      EasyLoading.dismiss();
      getProfile();
      update();
    }
  }

  List<HomeCard> get cardList => [
    // HomeCard(
    //   'Bookings',
    //   Icons.car_rental,
    //   Colors.orange,
    //   () => Get.toNamed(Routes.bookingList),
    //   'Your Bookings'
    // ),
    HomeCard(
      'All Bookings',
      Icons.swap_horiz,
      Colors.pinkAccent,
      () => Get.toNamed(Routes.bookingList),
      'All Your Bookings'
    ),
    HomeCard(
      'Summary',
      Icons.attach_money,
      Colors.green,
      () => Get.toNamed(Routes.summery),
      'Payment Summary'
    ),
    HomeCard(
      'Support',
      Icons.support_agent,
      Colors.redAccent,
      () => Get.toNamed(Routes.helpAndSupport),
      'Help and Support'
    ),
    HomeCard(
      'About',
      Icons.work,
      Colors.deepOrange,
      () => Get.toNamed(Routes.about),
      'About Us'
    ),
    HomeCard(
      'Logout',
      Icons.logout,
      Colors.deepPurpleAccent,
      () => AppSession.to.logout(),
      'Logout Now'
    ),
  ];
}
