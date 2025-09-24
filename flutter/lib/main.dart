import 'package:del_boy_app/utilities/app_pages.dart';
import 'package:del_boy_app/utilities/app_routes.dart';
import 'package:del_boy_app/utilities/com_binding.dart';
import 'package:flutter/material.dart';
import 'package:flutter_custom_utils/flutter_custom_utils.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:google_fonts/google_fonts.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await GetStorage.init('Del_Boy');
 
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: Routes.splash,
      defaultTransition: Transition.fade,
      initialBinding: ComBinding(),
      theme: ThemeData(
        textTheme: TextTheme(
          displayLarge: GoogleFonts.roboto(),
          displayMedium: GoogleFonts.roboto(),
          displaySmall: GoogleFonts.roboto(),
          headlineMedium: GoogleFonts.roboto(),
          headlineSmall: GoogleFonts.roboto(),
          titleLarge: GoogleFonts.roboto(),
          bodyLarge: GoogleFonts.roboto(),
          bodyMedium: GoogleFonts.roboto(),
          labelLarge: GoogleFonts.roboto(),
          bodySmall: GoogleFonts.roboto(),
        ),

        // primarySwatch: materialThemeColor(),
        //scaffoldBackgroundColor: scaffoldBg,
      ),
      builder: EasyLoading.init(
        builder: (context, child) {
          return MediaQuery(
            data: mQuery(context).copyWith(
              textScaler: TextScaler.linear(context.cIsTablet ? 1.0 : 1.0),
            ),
            child: child ?? const Text('error'),
          );
        },
      ),
      getPages: AppPages.pages,
    );
  }
}
