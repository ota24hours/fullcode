import 'package:del_boy_app/ui/model/base_model.dart';
import 'package:del_boy_app/ui/model/boocking_list_model.dart';
import 'package:del_boy_app/ui/model/booking_view_model.dart';
import 'package:del_boy_app/ui/model/login_model.dart';
import 'package:del_boy_app/ui/model/profile_model.dart';
import 'package:del_boy_app/ui/model/status_change_model.dart';
import 'package:del_boy_app/ui/model/summary_list.dart';
import 'package:del_boy_app/ui/model/verify_otp_model.dart';
import 'package:del_boy_app/utilities/strings.dart';
import 'package:flutter_custom_utils/util/string_utils.dart';
import 'package:flutter_custom_utils/util/utils.dart';
import 'package:get/get.dart';
import 'com_binding.dart';

class Api extends GetConnect {
  //------------------------------- oms -------------------------------
  static Api get to => Get.find();
  final error = false;
  final messahe = 'some error';
  var err = {'error': true, 'message': 'network issue'};

  @override
  void onInit() {
    super.onInit();
    httpClient.baseUrl = baseUrlCommon;
    httpClient.addRequestModifier<dynamic>((request) {
      request.headers['Authorization'] =
          AppSession.to.session.read(SessionKeys.API_KEY) ?? '';
      return request;
    });
  }

Future<LoginModel> login({ required String mob }) async {
  try {
    final response = await post(
      'user/login',
      cFormUrlEncode({'phone': mob}),
      contentType: 'application/x-www-form-urlencoded',
    );

    // 1️⃣ Log the full request URL:
    print('🔗 Request URL: ${response.request?.url}');

    // 2️⃣ Log the HTTP status:
    print('📟 Status code: ${response.statusCode}');
    print('📟 Status text: ${response.statusText}');

    // 3️⃣ Log headers & body for full visibility:
    print('📄 Response headers: ${response.headers}');
    print('📄 Response body: ${response.body}');

    // 4️⃣ Check for errors yourself:
    if (response.status.hasError) {
      throw Exception(
        'Login failed: ${response.statusCode} ${response.statusText}'
      );
    }

    // 5️⃣ Parse and return
    return LoginModel.fromJson(response.body);
  } catch (err, stack) {
    // This will catch DNS failures, socket errors, timeouts, etc.
    print('🚨 Network or parsing error: $err');
    print(stack);
    rethrow;
  }
}


  Future<VerifyModelClass> verifyOtp({
    required String otpKey,
    required String otp,
  }) {
    return post(
      'user/verify_user',
      cFormUrlEncode({'otpKey': otpKey, 'otp': otp}),
      contentType: 'application/x-www-form-urlencoded',
    ).then((value) {
      cLog('Otp Bind =?> ${value.body}');
      return VerifyModelClass.fromJson(value.body);
    });
  }

  Future<ProfileModel> getProfile() {
    return get('user/profile').then((value) {
      cLog('Profile Response ${value.body}');
      return ProfileModel.fromJson(value.body ?? err);
    });
  }

  Future<BaseModelClass> postUserLocation({
    required var lat,
    required var long,
  }) {
    cLog('lat$lat&& long $long');
    return post(
      'user/update',
      cFormUrlEncode({'lat': lat.toString(), 'lng': long.toString()}),
      contentType: 'application/x-www-form-urlencoded',
    ).then((value) {
      cLog('Location Added : ${value.body}');

      return BaseModelClass.fromJson(value.body ?? err);
    });
  }

  Future<BaseModelClass> changeStatus({required bool status}) {
    return post(
      'user/update',
      cFormUrlEncode({'active_status': status.toString()}),
      contentType: 'application/x-www-form-urlencoded',
    ).then((value) {
      cLog('status : ${value.body}');

      return BaseModelClass.fromJson(value.body ?? err);
    });
  }

  Future<BookingListModel> getBooking({required var page}) {
    return get('user/booking/list/$page').then((value) {
      cLog('Data => ${value.body}');

      return BookingListModel.fromJson(value.body ?? err);
    });
  }

  Future<BookingViewModel> getBookingView({required var id}) {
    return get('user/booking/view/$id').then((value) {
      cLog('Data => ${value.body}');

      return BookingViewModel.fromJson(value.body ?? err);
    });
  }

  Future<StatusChangeModel> statusChange({
    required String id,
    required String status,
  }) {
    return post(
      'user/booking/complete_booking',
      cFormUrlEncode({'id': id, 'status': status}),
      contentType: 'application/x-www-form-urlencoded',
    ).then((value) {
      cLog('data${value.body}');

      return StatusChangeModel.fromJson(value.body);
    });
  }

  Future<SummaryListModel> getSummary({var start, var end}) {
    return get(
      'user/transactions/getSummary?startDate=$start&endDate=$end',
    ).then((value) {
      cLog('Data summary => ${value.body}');

      return SummaryListModel.fromJson(value.body ?? err);
    });
  }
}
