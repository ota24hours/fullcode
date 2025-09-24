import 'dart:io';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';

class MapService {
  /// Redirects to the device’s map app, centered on [latitude],[longitude].
  /// Falls back to browser if no native app is available.
  Future<void> redirectToMap({
    required double latitude,
    required double longitude,
  }) async {
    // 1) Build the best URI for the platform:
    late Uri uri;
    if (Platform.isAndroid) {
      // Google Maps URI scheme on Android
      uri = Uri.parse('google.navigation:q=$latitude,$longitude');
    } else if (Platform.isIOS) {
      // Apple Maps URI scheme on iOS
      uri = Uri.parse('maps://?ll=$latitude,$longitude');
    } else {
      // Fallback to browser
      uri = Uri.parse(
        'https://www.google.com/maps/search/?api=1&query=$latitude,$longitude',
      );
    }

    // 2) Try to launch it:
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      // 3) If the native‐app URI failed, open browser search:
      final browserUri = Uri.parse(
        'https://www.google.com/maps/search/?api=1&query=$latitude,$longitude',
      );
      if (await canLaunchUrl(browserUri)) {
        await launchUrl(browserUri, mode: LaunchMode.externalApplication);
      } else {
        Get.snackbar('Error', 'Could not open map.');
      }
    }
  }
}

  /// Opens the phone dialer with [phoneNumber] pre-filled.
  Future<void> redirectToDialer({ required String phoneNumber }) async {
    final Uri telUri = Uri(scheme: 'tel', path: phoneNumber);

    if (await canLaunchUrl(telUri)) {
      await launchUrl(telUri, mode: LaunchMode.externalApplication);
    } else {
      Get.snackbar('Error', 'Could not open dialer.');
    }
  }
