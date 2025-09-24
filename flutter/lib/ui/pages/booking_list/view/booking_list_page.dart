// booking_page.dart
import 'package:del_boy_app/res/colors.dart';
import 'package:del_boy_app/res/images.dart';
import 'package:del_boy_app/res/style.dart';
import 'package:del_boy_app/ui/model/boocking_list_model.dart';
import 'package:del_boy_app/ui/pages/booking_list/bind/booking_list_binding.dart';
import 'package:del_boy_app/utilities/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class BookingPage extends StatelessWidget {
  const BookingPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Controller was bound via BookingBinding, so use find()
    final ctl = Get.find<BookingController>();

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) Get.back();
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          iconTheme: IconThemeData.fallback(),
          title: Obx(() => Text(ctl.pageTitle.value,style: customStyle(14.0, Colors.black, FontWeight.w400),)),
          backgroundColor: Colors.white,
          elevation: 0,
          foregroundColor: Colors.black,
        ),
        body: Obx(() {
          // Show full-screen spinner on first load
          if (ctl.isFirstLoading.value) {
            return const Center(child: CircularProgressIndicator());
          }

          return NotificationListener<ScrollNotification>(
            onNotification: (scrollInfo) {
              if (scrollInfo.metrics.pixels >=
                  scrollInfo.metrics.maxScrollExtent - 100) {
                ctl.fetchMore();
              }
              return false;
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: ctl.bookings.length + (ctl.hasMore ? 1 : 0),
              itemBuilder: (context, idx) {
                if (idx >= ctl.bookings.length) {
                  // bottom “load more” indicator
                  return const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16),
                    child: Center(child: CircularProgressIndicator()),
                  );
                }
                return _BookingCard(data: ctl.bookings[idx]);
              },
            ),
          );
        }),
      ),
    );
  }
}

class _BookingCard extends StatelessWidget {
  final Bookings data;
  const _BookingCard({required this.data});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Get.toNamed(Routes.bookingView, arguments: [data.id ?? '']);
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.shade300),
          boxShadow: const [
            BoxShadow(
              color: Color.fromRGBO(0, 0, 0, 0.3),
              blurRadius: 10,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Text(
              "The Booking Id is # ${data.id ?? ''}",
              style: TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
            ),
            const SizedBox(height: 12),

            // Avatar + Name + Details
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Avatar + online dot + name
                Column(
                  children: [
                    Stack(
                      children: [
                        CircleAvatar(
                          radius: 30,
                          backgroundImage: AssetImage(dummyProfile),
                          // NetworkImage(
                          //   data.user?.email ?? '',
                          // ),
                        ),
                        Positioned(
                          top: 0,
                          right: 0,
                          child: Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: Colors.green,
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      width: 80,
                      child: Text(
                        data.user?.name ?? '',
                        textAlign: TextAlign.center,
                        style: customStyle(14.0, darkText, FontWeight.w400),
                        maxLines: 2,
                        overflow: TextOverflow.fade,
                      ),
                    ),
                  ],
                ),

                const SizedBox(width: 16),

                // Booking details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildJobDetailRow("Time", ": ${data.startDate ?? ''}"),
                      _buildJobDetailRow(
                        "Property Name",
                        ": ${data.property?.name ?? ''}",
                      ),
                      _buildJobDetailRow("Total", ": ₹ ${data.totalAmount ?? ''}"),
                    ],
                  ),
                ),
              ],
            ),

            const Divider(height: 24, thickness: 1),

            // Bottom row: Locate, Status, Actions
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                // Status text
                Text(
                  data.status?.toUpperCase() ?? '',
                  style: TextStyle(
                    color: (data.status == 'PENDING')
                        ? primaryOrange
                        : (data.status == 'CONFIRMED')
                        ? Colors.green
                        : (data.status == 'CHECKED_IN')
                        ? const Color.fromARGB(255, 210, 189, 3)
                        : (data.status == 'COMPLETED')
                        ? Colors.blueAccent
                        : Colors.red,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildJobDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            ),
          ),
          Expanded(child: Text(value, style: const TextStyle(fontSize: 13))),
        ],
      ),
    );
  }
}
