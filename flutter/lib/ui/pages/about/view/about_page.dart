import 'package:del_boy_app/res/style.dart';
import 'package:flutter/material.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: IconThemeData.fallback(),
        title: Text(
          'About',
          style: customStyle(14.0, Colors.black, FontWeight.w400),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
      ),
      backgroundColor: const Color(0xFFF8F8FA), // light gray background
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              
              const SizedBox(height: 4),
              Expanded(
                child: SingleChildScrollView(
                  child: const Text("OTA 24HOURS empowers vendors with a fast, reliable, and seamless platform to manage bookings, track orders, and grow their business. Our vendor app is designed to give you full control, real-time updates, and easy communication with customers — all in one place.",
                    style: TextStyle(
                      fontSize: 14.5,
                      height: 1.6,
                      color: Colors.black87,
                      fontWeight: FontWeight.w400,
                    ),
                    textAlign: TextAlign.justify,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
