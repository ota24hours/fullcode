import 'package:del_boy_app/ui/pages/about/bind/about_bind.dart';
import 'package:del_boy_app/ui/pages/about/view/about_page.dart';
import 'package:del_boy_app/ui/pages/authorization/otp/bind/otp_binding.dart';
import 'package:del_boy_app/ui/pages/authorization/otp/view/otp_page.dart';
import 'package:del_boy_app/ui/pages/booking_view_page/bind/booking_view_bind.dart';
import 'package:del_boy_app/ui/pages/booking_view_page/view/booking_view_page.dart';
import 'package:del_boy_app/ui/pages/help/bind/help_bind.dart';
import 'package:del_boy_app/ui/pages/help/view/help_page.dart';
import 'package:del_boy_app/ui/pages/home/bind/home_binding.dart';
import 'package:del_boy_app/ui/pages/home/view/home_page.dart';
import 'package:del_boy_app/ui/pages/authorization/login/bind/login_binding.dart';
import 'package:del_boy_app/ui/pages/authorization/login/view/login_page.dart';
import 'package:del_boy_app/ui/pages/splash/bind/splash_bind.dart';
import 'package:del_boy_app/ui/pages/splash/view/splash_screen.dart';
import 'package:del_boy_app/ui/pages/booking_list/bind/booking_list_binding.dart';
import 'package:del_boy_app/ui/pages/booking_list/view/booking_list_page.dart';
import 'package:del_boy_app/ui/pages/summary_page/bind/summary_page_binding.dart';
import 'package:del_boy_app/ui/pages/summary_page/view/summary_page.dart';
import 'package:get/get.dart';

import 'app_routes.dart';

abstract class AppPages {
  static final pages = [
    GetPage(
      name: Routes.splash,
      page: () => const SplashPage(),
      binding: SplashBinding(),
    ),
    GetPage(
      name: Routes.login,
      page: () => const LoginPage(),
      binding: LoginBinding(),
    ),
    GetPage(name: Routes.otp, page: () => OtpPage(), binding: OtpBinding()),
    GetPage(
      name: Routes.home,
      page: () => const HomePage(),
      binding: HomeBinding(),
    ),
    GetPage(
      name: Routes.bookingList,
      page: () => BookingPage(),
      binding: BookingBinding(),
    ),
    GetPage(
      name: Routes.bookingView,
      page: () => BookingViewPage(),
      binding: BookingViewBinding(),
    ),
    GetPage(
      name: Routes.summery,
      page: () => TransactionView(),
      binding: SummaryBinding(),
    ),
    GetPage(
      name: Routes.about,
      page: () => AboutPage(),
      binding: AboutBinding(),
    ),
    GetPage(
      name: Routes.helpAndSupport,
      page: () => HelpPage(),
      binding: HelpBinding(),
    ),
  ];
}
