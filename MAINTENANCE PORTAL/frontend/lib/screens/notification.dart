import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class NotificationsScreen extends StatefulWidget {
  final String iwerk;

  const NotificationsScreen({Key? key, required this.iwerk}) : super(key: key);

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  bool _loading = true;
  String? _error;
  List<dynamic> _data = [];

  static const String _baseUrl = 'http://localhost:3000';

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    try {
      final uri = Uri.parse('$_baseUrl/api/notifications')
          .replace(queryParameters: {'iwerk': widget.iwerk});

      final res = await http.get(uri);
      final body = jsonDecode(res.body);

      if (body['success'] == true) {
        _data = body['data'];
      } else {
        _error = body['error'];
      }
    } catch (e) {
      _error = e.toString();
    }
    setState(() {
      _loading = false;
    });
  }

  String _formatDate(String? sapDate) {
    if (sapDate == null || sapDate.isEmpty) return '-';
    final millis = RegExp(r'\d+').firstMatch(sapDate)?.group(0);
    if (millis == null) return '-';
    final d = DateTime.fromMillisecondsSinceEpoch(int.parse(millis));
    return '${d.day.toString().padLeft(2, '0')}-'
        '${d.month.toString().padLeft(2, '0')}-${d.year}';
  }

  /// ✅ PRIORITY UI
  Color _priorityColor(String? p) {
    switch (p) {
      case '1':
        return Colors.green;
      case '2':
        return Colors.orange;
      case '3':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _priorityText(String? p) {
    switch (p) {
      case '1':
        return 'Low';
      case '2':
        return 'Medium';
      case '3':
        return 'High';
      default:
        return 'Normal';
    }
  }

  Widget _badge(String? pri) {
    final color = _priorityColor(pri);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color),
      ),
      child: Text(
        _priorityText(pri),
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _row(String label, String? value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          SizedBox(
            width: 130,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
          Expanded(child: Text(value ?? '-')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      /// ✅ STATIC NAV BAR (UNCHANGED)
      // appBar: AppBar(
      //   backgroundColor: const Color(0xFF2E3440),
      //   title: const Text('Notifications'),
      // ),
      appBar: AppBar(
  backgroundColor: const Color(0xFF2E3440),

  // ✅ makes back arrow white
  iconTheme: const IconThemeData(color: Colors.white),

  // ✅ makes title text white
  titleTextStyle: const TextStyle(
    color: Colors.white,
    fontSize: 20,
    fontWeight: FontWeight.w600,
  ),

  title: const Text('Notifications'),
),

      /// ✅ DASHBOARD-MATCHING BACKGROUND
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xFF9BC9CC),
              Color(0xFFCAB6A0),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),

        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(child: Text(_error!))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _data.length,
                    itemBuilder: (context, i) {
                      final n = _data[i];

                      return Card(
                        elevation: 8,
                        margin: const EdgeInsets.only(bottom: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(18),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              /// ✅ HEADER ROW
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  CircleAvatar(
                                    backgroundColor:
                                        Colors.blue.withOpacity(0.15),
                                    child: const Icon(
                                      Icons.notifications,
                                      color: Colors.blue,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      n['Qmtxt'] ?? '',
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  _badge(n['Priok']),
                                ],
                              ),
                              const SizedBox(height: 14),

                              _row('Notification No', n['Qmnum']),
                              _row('Equipment', n['Equnr']),
                              _row('Work Order', n['Aufnr']),
                              _row('Plant', n['Iwerk']),
                              _row('Work Center', n['Arbplwerk']),
                              _row('Created On', _formatDate(n['Erdat'])),
                              _row('Start Date', _formatDate(n['Strmn'])),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}
