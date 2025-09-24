import 'package:del_boy_app/res/colors.dart';
import 'package:del_boy_app/res/style.dart';
import 'package:del_boy_app/ui/pages/booking_list/bind/booking_list_binding.dart';
import 'package:del_boy_app/ui/pages/booking_view_page/bind/booking_view_bind.dart';
import 'package:del_boy_app/utilities/common_utilities.dart';
import 'package:flutter/material.dart';
import 'package:flutter_custom_utils/flutter_custom_utils.dart';
import 'package:flutter_custom_utils/util/widget_utils.dart';
import 'package:get/get.dart';

class BookingViewPage extends StatelessWidget {
  final BookingViewController logic = Get.put(BookingViewController());

  BookingViewPage({super.key});

  @override
  Widget build(BuildContext context) {
    return GetBuilder<BookingViewController>(
      builder: (logic) {
        var data = logic.bookingViewModel?.data;
        return PopScope(
          canPop: false,
          onPopInvokedWithResult: (didPop, _) {
            if (!didPop) {
              Get.back();
              bool initialized = Get.isRegistered<BookingController>();
              logic.update();
              if (initialized) {
                BookingController.to.onInit();
              }
            }
          },
          child: Scaffold(
            
            appBar: AppBar(
              iconTheme: IconThemeData.fallback(),
              title: Text(
                "Booking Details",
                style: customStyle(14.0, Colors.black, FontWeight.w400),
              ),
              leading: const BackButton(),
              elevation: 0,
              backgroundColor: Colors.white,
              foregroundColor: Colors.black,
            ),
            backgroundColor: Colors.white,
            body: SingleChildScrollView(
              physics: BouncingScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            data?.user?.name ?? '',
                            style: customStyle(
                              16.0,
                              Colors.black,
                              FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            data?.user?.phone ?? '',
                            style: customStyle(
                              14.0,
                              Colors.black,
                              FontWeight.w400,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            data?.user?.email ?? '',
                            style: customStyle(
                              14.0,
                              Colors.black,
                              FontWeight.w400,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Booking Details",
                          style: customStyle(
                            16.0,
                            Colors.black,
                            FontWeight.bold,
                          ),
                        ),
                        Text(
                          data?.status ?? ''.toUpperCase(),
                          style: customStyle(
                            14.0,
                            (data?.status == 'PENDING')
                                ? primaryOrange
                                : (data?.status == 'CONFIRMED')
                                ? Colors.green
                                : (data?.status == 'CHECKED_IN')
                                ? const Color.fromARGB(255, 210, 189, 3)
                                : (data?.status == 'COMPLETED')
                                ? Colors.blueAccent
                                : Colors.red,
                            FontWeight.bold,
                          ),
                        ),
                      ],
                    ),

                    Column(
                      children: [
                        buildDetailRow('Booking Id', ": #${data?.id ?? ''}"),
                        buildDetailRow(
                          'Start Date',
                          ": ${data?.startDate ?? ''}",
                        ),
                        buildDetailRow('End Date', ": ${data?.endDate ?? ''}"),
                        buildDetailRow(
                          'Number Of Unite',
                          ": ${data?.unitsBooked ?? ''} unites",
                        ),

                        buildDetailRow(
                          'Breakfast Include',
                          ': ${(data?.property?.hasDiningFacility ?? false) ? 'Yes' : 'No'}',
                        ),
                      ],
                    ).cPadOnly(t: 10, l: 5),
                    const SizedBox(height: 20),
                    Text(
                      "Property Details",
                      style: customStyle(16.0, Colors.black, FontWeight.bold),
                    ),
                    SizedBox(height: 15),
                    Container(
                      padding: EdgeInsets.only(
                        left: 15,
                        top: 10,
                        right: 10,
                        bottom: 10,
                      ),

                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        color: Colors.white,
                        boxShadow: const [
                          BoxShadow(color: Colors.black12, blurRadius: 6),
                        ],
                      ),
                      child: Row(
                        children: [
                          SizedBox(
                            width: 100,
                            height: 90,
                            child: Image.network(
                              ((data?.property?.propertyVariants??[]).isEmpty)? data?.property?.image??'':data?.property?.propertyVariants?.first.propertyImgs?.first.imgUrl??'',
                              fit: BoxFit.fill,
                            ).cClipAll(12),
                          ),
                          SizedBox(width: 10),
                          Column(
                            children: [
                              buildDetailRow(
                                'Name',
                                ': ${data?.property?.name ?? ''}',
                              ),
                              buildDetailRow(
                                'Type',
                                ': ${data?.property?.propertyType ?? ''}',
                              ),
                              buildDetailRow(
                                'Total Unite',
                                ': ${data?.property?.totalUnits ?? ''}',
                              ),
                              buildDetailRow(
                                'Dining Facility',
                                ': ${(data?.property?.hasDiningFacility ?? false) ? 'Available' : 'Not Available'}',
                              ),
                            ],
                          ).cExpanded(1),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        iconButton(
                          Icons.location_on_outlined,
                          "Locate Address",
                          onTap: () {
                            logic.onTapNavigate(
                              double.parse(
                                (data?.property?.latitude ?? '').toString(),
                              ),
                              double.parse(
                                (data?.property?.longitude ?? '').toString(),
                              ),
                            );
                          },
                        ),
                        iconButton(
                          Icons.call,
                          "Get in Contact",
                          onTap: () {
                            redirectToDialer(
                              phoneNumber: data?.user?.phone ?? '',
                            );
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Text(
                          "Price Details",
                          style: customStyle(
                            16.0,
                            Colors.black,
                            FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    PaymentCard(
                      paymentMode: data?.paymentType ?? '0',
                      isPaid: data?.paymentGatewayId ?? ''.isNotEmpty,
                      baseAmount: data?.baseAmount ?? '0',
                      taxAmount: data?.taxAmount ?? '0',
                      extraAmount: data?.extrasAmount ?? '0',
                      totalAmount: data?.totalAmount ?? '',
                    ),
                    SizedBox(height: 20),
                    if ((data?.status == 'PENDING') ||
                        (data?.status == 'CONFIRMED') ||
                        (data?.status == 'CHECKED_IN'))
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          onPressed: () {
                            logic.changeStatus(
                              (data?.status == 'PENDING')
                                  ? 'CONFIRMED'
                                  : (data?.status == 'CONFIRMED')
                                  ? 'CHECKED_IN'
                                  : 'COMPLETED',
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: Text(
                            '${(data?.status == 'PENDING')
                                ? 'CONFIRMED BOOKING'
                                : (data?.status == 'CONFIRMED')
                                ? 'CHECKED IN'
                                : 'COMPLETE BOOKING'} ',
                            style: customStyle(
                              16.0,
                              Colors.white,
                              FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    SizedBox(height: 10),
                    if ((data?.status == 'PENDING') ||
                        (data?.status == 'CONFIRMED'))
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          onPressed: () {
                            logic.changeStatus('CANCELED');
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: Text(
                            (data?.status == 'PENDING')
                                ? 'DECLINE BOOKING'
                                : 'CANCEL BOOKING',
                            style: customStyle(
                              16.0,
                              Colors.white,
                              FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget iconButton(IconData icon, String text, {void Function()? onTap}) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: 130,
        height: 90,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: Colors.white,
          boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 6)],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.deepOrange, size: 28),
            const SizedBox(height: 8),
            Text(
              text,
              style: customStyle(14.0, primaryOrange, FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}

class PaymentCard extends StatelessWidget {
  final String paymentMode;
  final bool isPaid;
  final String baseAmount;
  final String taxAmount;
  final String extraAmount;
  final String totalAmount;

  const PaymentCard({
    super.key,
    required this.paymentMode,
    required this.isPaid,
    required this.baseAmount,
    required this.taxAmount,
    required this.extraAmount,
    required this.totalAmount,
  });

  Widget _row(String label, String value, {Color? color}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: customStyle(14.0, Colors.black, FontWeight.w400)),
          Text(
            value,
            style: customStyle(14.0, color ?? Colors.black, FontWeight.w400),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.deepOrange.shade100),
        borderRadius: BorderRadius.circular(10),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
        color: Colors.white,
      ),
      child: Column(
        children: [
          _row(
            "Payment Mode",
            " $paymentMode ${isPaid ? '(Paid)' : ''}",
            color: isPaid ? Colors.green : Colors.black,
          ),
          const Divider(),
          _row("Sub Total", "₹ $baseAmount", color: Colors.green),
          _row("Tax Amount", "₹ $taxAmount", color: Colors.deepOrange),
          _row("Additional Amount", "₹ $extraAmount", color: Colors.deepOrange),
          const Divider(),
          _row("TOTAL", "₹ $totalAmount", color: Colors.green),
        ],
      ),
    );
  }
}

Widget buildDetailRow(String label, String value) {
  return Padding(
    padding: const EdgeInsets.only(bottom: 6),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 110,
          child: Text(
            "$label:",
            style: customStyle(13.0, Colors.black, FontWeight.bold),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: customStyle(13.0, Colors.black, FontWeight.normal),
          ),
        ),
      ],
    ),
  );
}
