import 'package:del_boy_app/res/style.dart';
import 'package:del_boy_app/ui/pages/summary_page/bind/summary_page_binding.dart';
import 'package:flutter/material.dart';
import 'package:flutter_custom_utils/flutter_custom_utils.dart';
import 'package:get/get.dart';

class TransactionView extends GetView<TransactionController> {
  const TransactionView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: IconThemeData.fallback(),
        title: Text(
          'Summary',
          style: customStyle(14.0, Colors.black, FontWeight.w400),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
      ),
      body: Obx(
        () => Column(
          children: [
            _buildDateRangePicker(), // 👈 New
            _buildSummaryCard(),
            const Divider(height: 0),
            Expanded(
              child: ListView.separated(
                itemCount:controller.summaryListModel.value?.data?.payments?.length ?? 0,
                separatorBuilder: (_, __) => const Divider(indent: 70),
                itemBuilder: (_, index) {
                  final tx =controller.summaryListModel.value?.data?.payments?[index];
                  return ListTile(
                    leading: const CircleAvatar(
                      backgroundColor: Color(0xFFFFE5E5),
                      child: Text(
                        '#',
                        style: TextStyle(
                          color: Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    title: Text(
                      'ID : ${tx?.id ?? ''}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Row(
                      children: [
                        Icon(
                          Icons.calendar_today_outlined,
                          size: 14,
                          color: Colors.grey,
                        ),
                        SizedBox(width: 4),
                        Text(
                          (tx?.createdAt)!.cGetFormattedDate(
                            format: 'dd-MM-yyyy HH:mm:ss aa',
                          ),
                          style: TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                    trailing: Text(
                      "₹ ${tx?.amount ?? ''}",
                      style: const TextStyle(
                        fontSize: 15.0,
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDateRangePicker() {
    return Obx(() {
      final hasDates = controller.hasSelectedDates;

      return Container(
        margin: const EdgeInsets.fromLTRB(16, 16, 16, 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.indigo.shade50,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.indigo.withOpacity(0.1)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            // Date Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Expanded(
                  child: _buildDateButton(
                    label: controller.fromDate.value != null
                        ? controller.formatDate(controller.fromDate.value!)
                        : "From Date",
                    icon: Icons.calendar_today,
                    onTap: controller.pickFromDate,
                    isActive: controller.fromDate.value != null,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildDateButton(
                    label: controller.toDate.value != null
                        ? controller.formatDate(controller.toDate.value!)
                        : "To Date",
                    icon: Icons.calendar_today,
                    onTap: controller.pickToDate,
                    isActive: controller.toDate.value != null,
                  ),
                ),
              ],
            ),
            if (hasDates)
              Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Align(
                  alignment: Alignment.centerRight,
                  child: TextButton.icon(
                    onPressed: controller.clearDateRange,
                    icon: const Icon(Icons.clear, color: Colors.red, size: 18),
                    label: const Text(
                      'Clear',
                      style: TextStyle(
                        color: Colors.red,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.red,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      );
    });
  }

  Widget _buildDateButton({
    required String label,
    required IconData icon,
    required VoidCallback onTap,
    bool isActive = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: isActive ? Colors.indigo : Colors.white,
          borderRadius: BorderRadius.circular(30),
          border: Border.all(color: Colors.indigo.withOpacity(0.2)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 18,
              color: isActive ? Colors.white : Colors.indigo,
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                color: isActive ? Colors.white : Colors.indigo,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCard() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
      decoration: BoxDecoration(
        color: Colors.indigo.shade50,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.indigo.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _buildAmountColumn(
            "Total Due",
            "₹ ${controller.summaryListModel.value?.data?.totalDue ?? '0'}",
            Colors.red,
          ),
          _buildAmountColumn(
            "Total Paid",
            "₹ ${controller.summaryListModel.value?.data?.totalPaid ?? '0'}",
            Colors.green,
          ),
          _buildAmountColumn(
            "Outstanding",
            "₹ ${controller.summaryListModel.value?.data?.outstanding ?? 0}",
            Colors.orange,
          ),
        ],
      ),
    );
  }

  Widget _buildAmountColumn(String title, String amount, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          title,
          style: const TextStyle(color: Colors.black54, fontSize: 13),
        ),
        const SizedBox(height: 4),
        Text(
          amount,
          style: TextStyle(
            color: color,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
