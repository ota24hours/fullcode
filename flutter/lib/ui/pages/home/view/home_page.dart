// View
import 'package:del_boy_app/ui/pages/home/bind/home_binding.dart';
import 'package:del_boy_app/ui/pages/profile/view/profile_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:del_boy_app/res/colors.dart';
import 'package:del_boy_app/res/images.dart';
import 'package:del_boy_app/res/style.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  static const _headerHeight = 300.0;
  static const _overlap = 40.0;

  @override
  Widget build(BuildContext context) {
    Get.put(HomeController());

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) !_showExitDialog(context);
      },
      child: Scaffold(
        backgroundColor: primaryColor,
        bottomNavigationBar: Obx(() {
          return BottomNavigationBar(
            currentIndex: HomeController.to.selectedIndex.value,
            onTap: HomeController.to.onNavTap,
            backgroundColor: Color.fromRGBO(255, 237, 227, 1),
            selectedItemColor: primaryOrange,
            unselectedItemColor: Colors.grey,
            items: const [
              BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
              BottomNavigationBarItem(
                icon: Icon(Icons.person),
                label: 'Profile',
              ),
            ],
          );
        }),
        body: Obx(() {
          return IndexedStack(
            index: HomeController.to.selectedIndex.value,
            children: [_buildDashboard(), ProfilePage()],
          );
        }),
      ),
    );
  }

  bool _showExitDialog(BuildContext ctx) {
    showDialog(
      context: ctx,
      builder: (_) => AlertDialog(
        title: const Text('Are you sure?'),
        content: const Text('Want to close the app?'),
        actions: [
          TextButton(child: const Text('Cancel'), onPressed: () => Get.back()),
          TextButton(
            child: const Text('Ok'),
            onPressed: () {
              HomeController.to.exitApp();
            },
          ),
        ],
      ),
    );
    return true;
  }

  Widget _buildDashboard() {
    return Stack(
      children: [
        NestedScrollView(
          headerSliverBuilder: (_, __) => [
            SliverAppBar(
              expandedHeight: _headerHeight,
              backgroundColor: primaryColor,
              elevation: 0,
              flexibleSpace: FlexibleSpaceBar(background: _buildHeader()),
            ),
          ],
          body: Container(color: primaryColor),
        ),
        Positioned(
          top: _headerHeight - _overlap,
          left: 0,
          right: 0,
          bottom: 0,
          child: ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            child: Container(
              color: Colors.white,
              child: ListView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 16,
                ),
                children: [
                  Align(
                    alignment: Alignment.center,
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: HomeController.to.cardList.length,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          mainAxisSpacing: 16,
                          crossAxisSpacing: 16,
                          childAspectRatio: 1.5,
                        ),
                    itemBuilder: (_, i) =>
                        _HomeCardWidget(card: HomeController.to.cardList[i]),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildHeader() {
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.asset(home, fit: BoxFit.cover),
        const DecoratedBox(decoration: BoxDecoration(color: Colors.black38)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16).copyWith(top: 56),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Location
              Align(
                alignment: Alignment.topRight,
                child: Obx(
                  () => Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        HomeController.to.currentAddress.value,
                        style: customStyle(14, Colors.white, FontWeight.w400),
                      ),
                      Icon(Icons.location_on_outlined, color: Colors.white),
                    ],
                  ),
                ),
              ),
              const Spacer(),
              Text(
                'WELCOME',
                style: customStyle(16.0, Colors.white, FontWeight.w700),
              ),
              const SizedBox(height: 4),
              Obx(
                () => Text(
                  HomeController.to.profile.value?.data?.name ?? '--',
                  style: customStyle(16.0, Colors.white, FontWeight.w400),
                ),
              ),
              const SizedBox(height: 8),
              Obx(
                () => Text(
                  'Mob: ${HomeController.to.profile.value?.data?.phone ?? ''}',
                  style: customStyle(14.0, Colors.white70, FontWeight.w400),
                ),
              ),
              Obx(
                () => Text(
                  'Email: ${HomeController.to.profile.value?.data?.email ?? ''}',
                  style: customStyle(14.0, Colors.white70, FontWeight.w400),
                ),
              ),
              const SizedBox(height: 12),
              _buildOnlineSwitch(),
              const SizedBox(height: 56),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildOnlineSwitch() {
    return Row(
      children: [
        // const Icon(Icons.notifications, size: 20, color: Colors.white),
        const Spacer(),
        Obx(
          () => Transform.scale(
            scale: 1,
            child: Switch(
              value: HomeController.to.profile.value?.data?.activeStatus??false,
              onChanged: (v) {
                HomeController.to.changeStatus(v);
                
              },
              activeTrackColor: Colors.greenAccent,
              activeColor: Colors.white,
            ),
          ),
        ),
      ],
    );
  }
}

// Card model & widget keep same as before
class HomeCard {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback? onTap;
  HomeCard(this.title, this.icon, this.color, this.onTap,this.subtitle);
}

// Card widget
class _HomeCardWidget extends StatelessWidget {
  final HomeCard card;
  const _HomeCardWidget({required this.card});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: card.onTap,
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 6,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(card.icon, size: 32, color: card.color),
              const SizedBox(height: 8),
              Text(card.title, style: const TextStyle(fontSize: 14)),
              const SizedBox(height: 4),
               Text(
                card.subtitle,
                style: TextStyle(fontSize: 10, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
