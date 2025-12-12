import 'package:flutter/material.dart';
import 'login.dart';
import 'notification.dart';
import 'plantlist.dart';
import 'workorder.dart';

class DashboardScreen extends StatelessWidget {
  final String engineerId;

  const DashboardScreen({Key? key, required this.engineerId}) : super(key: key);

  void _logout(BuildContext context) {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => LoginScreen()),
      (route) => false,
    );
  }

  /// ✅ COMMON DASHBOARD TILE
  Widget _buildCard({
    required BuildContext context,
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return InkWell(
      borderRadius: BorderRadius.circular(28),
      onTap: onTap,
      child: Card(
        elevation: 12,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(28),
        ),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(28),
            color: Colors.grey.shade100,
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 34,
                backgroundColor: Colors.grey.shade300,
                child: Icon(icon, size: 30, color: Colors.black87),
              ),
              const SizedBox(height: 18),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      /// ✅ STATIC TOP BAR
      appBar: AppBar(
        backgroundColor: const Color(0xFF2E3440),

        /// ✅ title white
        titleTextStyle: const TextStyle(
          color: Colors.white,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
        title: const Text('Maintenance Portal'),

        /// ✅ icons + text white
        iconTheme: const IconThemeData(color: Colors.white),

        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Row(
              children: [
                const Icon(Icons.person_outline, color: Colors.white),
                const SizedBox(width: 6),
                Text(
                  engineerId,
                  style: const TextStyle(color: Colors.white),
                ),
                const SizedBox(width: 16),
                IconButton(
                  icon: const Icon(Icons.logout, color: Colors.white),
                  onPressed: () => _logout(context),
                ),
              ],
            ),
          ),
        ],
      ),

      /// ✅ BACKGROUND
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xFF9BC9CC),
              Color(0xFFCAB6A0),
            ],
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
          ),
        ),

        /// ✅ RESPONSIVE GRID (FIXED MOBILE ISSUE)
        child: GridView.count(
          padding: const EdgeInsets.all(24),
          crossAxisCount: screenWidth < 600 ? 1 : 3,
          mainAxisSpacing: 24,
          crossAxisSpacing: 24,
          childAspectRatio: 1.35,
          children: [
            /// ✅ NOTIFICATIONS
            _buildCard(
              context: context,
              icon: Icons.notifications_none,
              title: 'Notifications',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => NotificationsScreen(iwerk: '0001'),
                  ),
                );
              },
            ),

            /// ✅ PLANT LIST
            _buildCard(
              context: context,
              icon: Icons.factory_outlined,
              title: 'Plant List',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const PlantListScreen(),
                  ),
                );
              },
            ),

            /// ✅ WORK ORDERS
            _buildCard(
              context: context,
              icon: Icons.assignment_outlined,
              title: 'Work Orders',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => WorkOrderScreen(werks: '0001'),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
