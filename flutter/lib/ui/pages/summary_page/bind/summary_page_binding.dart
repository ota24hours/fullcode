import 'package:del_boy_app/ui/model/summary_list.dart';
import 'package:del_boy_app/utilities/api_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

class SummaryBinding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<TransactionController>(() => TransactionController());
  }
}

class TransactionController extends GetxController {
  // Reactive summary data
  final summaryListModel = Rxn<SummaryListModel>();

  final totalDue = 800.obs;
  final totalPaid = 500.obs;

  // Date pickers
  final Rxn<DateTime> fromDate = Rxn<DateTime>();
  final Rxn<DateTime> toDate = Rxn<DateTime>();

  // Sample transactions (mock)
  final transactions = List.generate(
    8,
    (index) => {
      'title': 'Groceries',
      'date': 'Yesterday at 16:34',
      'amount': 'Rs 100',
    },
  ).obs;

  int get outstanding => totalDue.value - totalPaid.value;

  String formatDate(DateTime date) => DateFormat('dd MMM yyyy').format(date);
  String formatDatePass(DateTime date) => DateFormat('yyyy-MM-dd').format(date);

  bool get hasSelectedDates => fromDate.value != null && toDate.value != null;

  @override
  void onInit() {
    super.onInit();
    getData();
  }

  Future<void> pickFromDate() async {
    final picked = await showDatePicker(
      context: Get.context!,
      initialDate: fromDate.value ?? DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: toDate.value ?? DateTime.now(),
    );
    if (picked != null) {
      fromDate.value = picked;
      // Ensure toDate is not before fromDate
      if (toDate.value != null && toDate.value!.isBefore(picked)) {
        toDate.value = null;
      }
      await getData();
    }
  }

  Future<void> pickToDate() async {
    final picked = await showDatePicker(
      context: Get.context!,
      initialDate: toDate.value ?? DateTime.now(),
      firstDate: fromDate.value ?? DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      toDate.value = picked;
      await getData();
    }
  }

  void clearDateRange() {
    fromDate.value = null;
    toDate.value = null;
    getData();
  }

  Future<void> getData() async {
    try {
      EasyLoading.show();
      final result = await Api.to.getSummary(
        start: hasSelectedDates ? formatDatePass(fromDate.value!) : '',
        end: hasSelectedDates ? formatDatePass(toDate.value!) : '',
      );
      summaryListModel.value = result;
    } catch (e) {
      EasyLoading.showError('Failed to fetch summary');
    } finally {
      EasyLoading.dismiss();
      update();
    }
  }
}
