import 'package:del_boy_app/res/images.dart';
import 'package:del_boy_app/res/style.dart';
import 'package:del_boy_app/utilities/com_binding.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_custom_utils/util/widget_utils.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:del_boy_app/res/colors.dart';
import 'package:del_boy_app/ui/pages/profile/bind/profile_binding.dart';

class ProfilePage extends StatelessWidget {
  ProfilePage({super.key});

  final ProfileController controller = Get.put(ProfileController());

  @override
  Widget build(BuildContext context) {
    final double fontScale = MediaQuery.of(context).textScaleFactor;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _buildAppBar(fontScale),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.only(bottom: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildProfile(fontScale),
              _buildTitleWithEdit(fontScale),
              const SizedBox(height: 10),
              _buildTextField(controller.nameCtrl, 'Full Name*', Icons.person),
              _buildPhoneField(
                controller.phoneCtrl,
                'Phone Number*',
                Icons.phone,
              ),
              _buildTextField(
                controller.emailCtrl,
                'Email Address*',
                Icons.email,
              ),
              _buildTextField(
                controller.secondaryNameCtrl,
                'Secondary Name',
                Icons.person_outline,
              ),
              _buildPhoneField(
                controller.secondaryPhoneCtrl,
                'Secondary Phone',
                Icons.phone_android,
              ),
              _buildDatePicker(
                context,
                controller.dobCtrl,
                'Date of Birth',
                Icons.cake,
              ),
              _buildTextField(
                controller.addressCtrl,
                'Address*',
                Icons.location_on,
              ),
              _buildTextField(controller.ageCtrl, 'Age', Icons.numbers),
              _buildTextField(controller.countryCtrl, 'Country', Icons.flag),
              _buildTextField(controller.stateCtrl, 'State', Icons.map),
              _buildTextField(
                controller.districtCtrl,
                'District',
                Icons.location_city,
              ),
              const SizedBox(height: 30),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Obx(() {
                  return (!(controller.isEdit.value))
                      ? TextButton.icon(
                          onPressed: () {
                            AppSession.to.logout();
                          },
                          icon: Icon(Icons.logout_outlined),
                          label: Text(
                            'Logout',
                            style: customStyle(
                              14.0,
                              Colors.red,
                              FontWeight.bold,
                            ),
                          ),
                        ).cToCenter
                      : SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: ElevatedButton(
                            onPressed:
                                controller.isEdit.value &&
                                    controller.isFormValid()
                                ? controller.saveAndSubmit
                                : null,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: primaryOrange,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: Text(
                              'Save and Submit',
                              style: customStyle(
                                16 * fontScale,
                                Colors.white,
                                FontWeight.bold,
                              ),
                            ),
                          ),
                        );
                }),
              ),
            ],
          ),
        ),
      ),
    );
  }

  AppBar _buildAppBar(double scale) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      systemOverlayStyle: SystemUiOverlayStyle.dark,
      title: Text(
        'Profile',
        style: TextStyle(
          color: Colors.black,
          fontSize: 18 * scale,
          fontWeight: FontWeight.w600,
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.search, color: Colors.black),
          onPressed: () {},
        ),
      ],
    );
  }

  Widget _buildProfile(double scale) {
    return GetBuilder<ProfileController>(
      builder: (logic) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Row(
            children: [
              CircleAvatar(
                radius: 26,
                backgroundImage: (logic.profileModel?.data?.profileUrl == null)
                    ? AssetImage(dummyProfile)
                    : NetworkImage(logic.profileModel?.data?.profileUrl ?? ''),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      logic.profileModel?.data?.name ?? '',
                      style: TextStyle(
                        fontSize: 16 * scale,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${logic.profileModel?.data?.email ?? ''} \n${logic.profileModel?.data?.phone ?? ''}',
                      style: TextStyle(
                        fontSize: 12 * scale,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildTitleWithEdit(double scale) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Obx(
            () => Text(
              !controller.isEdit.value ? 'Details' : 'Edit Profile',
              style: TextStyle(
                fontSize: 18 * scale,
                fontWeight: FontWeight.w700,
                color: Colors.black,
              ),
            ),
          ),
          // if (!(controller.isEdit.value))
          //   IconButton(
          //     icon: Icon(Icons.edit, color: Colors.grey),
          //     onPressed: () => controller.isEdit.toggle(),
          //   ),
        ],
      ),
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String hint,
    IconData icon,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Obx(
        () => Container(
          height: 48,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            boxShadow: const [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 4,
                offset: Offset(0, 2),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Row(
            children: [
              Icon(icon, color: Colors.grey[700]),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: controller,
                  enabled: this.controller.isEdit.value,
                  decoration: InputDecoration(
                    hintText: hint,
                    border: InputBorder.none,
                    isDense: true,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPhoneField(
    TextEditingController controller,
    String hint,
    IconData icon,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Obx(
        () => Container(
          height: 48,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            boxShadow: const [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 4,
                offset: Offset(0, 2),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Row(
            children: [
              Icon(icon, color: Colors.grey[700]),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: controller,
                  enabled: this.controller.isEdit.value,
                  keyboardType: TextInputType.phone,
                  maxLength: 10,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  decoration: const InputDecoration(
                    hintText: '',
                    counterText: '',
                    border: InputBorder.none,
                    isDense: true,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDatePicker(
    BuildContext context,
    TextEditingController controller,
    String hint,
    IconData icon,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Obx(
        () => GestureDetector(
          onTap: this.controller.isEdit.value
              ? () async {
                  DateTime? picked = await showDatePicker(
                    context: context,
                    initialDate: DateTime(2000),
                    firstDate: DateTime(1900),
                    lastDate: DateTime.now(),
                  );
                  if (picked != null) {
                    controller.text = DateFormat('dd/MM/yyyy').format(picked);
                  }
                }
              : null,
          child: Container(
            height: 48,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              boxShadow: const [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 4,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              children: [
                Icon(icon, color: Colors.grey[700]),
                const SizedBox(width: 12),
                Expanded(
                  child: AbsorbPointer(
                    child: TextField(
                      controller: controller,
                      enabled: this.controller.isEdit.value,
                      decoration: InputDecoration(
                        hintText: hint,
                        border: InputBorder.none,
                        isDense: true,
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
  }
}
