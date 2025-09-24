import 'package:flutter/material.dart';
import 'package:del_boy_app/res/style.dart';

class HelpPage extends StatelessWidget {
  const HelpPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F8FA),
      appBar: AppBar(
        title: Text(
          'Help and Support',
          style: customStyle(14.0, Colors.black, FontWeight.w400),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: const SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: ContactInfoWidget(),
        ),
      ),
    );
  }
}

class ContactInfoWidget extends StatelessWidget {
  const ContactInfoWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(5),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          _buildContactTile(
            icon: Icons.headset_mic,
            iconColor: Colors.red.shade600,
            title: "Customer Support",
            subtitle: "+91 9633926023",
          ),
          SizedBox(height: 20,),
          _buildContactTile(
            icon: Icons.chat,
            iconColor: Colors.green.shade600,
            title: "Drop Us an Email",
            subtitle: "mail@ota24hours.com",
          ),
        ],
      ),
    );
  }

  Widget _buildContactTile({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CircleAvatar(
          radius: 20,
          backgroundColor: iconColor,
          child: Icon(icon, color: Colors.white, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: customStyle(14, Colors.black, FontWeight.w400)),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: customStyle(15, Colors.black87, FontWeight.bold),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
