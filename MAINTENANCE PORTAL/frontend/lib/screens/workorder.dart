import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class WorkOrderScreen extends StatefulWidget {
  final String werks;

  const WorkOrderScreen({Key? key, required this.werks}) : super(key: key);

  @override
  State<WorkOrderScreen> createState() => _WorkOrderScreenState();
}

class _WorkOrderScreenState extends State<WorkOrderScreen> {
  bool _isLoading = true;
  String? _error;
  List<dynamic> _workorders = [];

  static const String _baseUrl = 'http://localhost:3000';

  @override
  void initState() {
    super.initState();
    _loadWorkOrders();
  }

  Future<void> _loadWorkOrders() async {
    try {
      final uri = Uri.parse('$_baseUrl/api/workorders')
          .replace(queryParameters: {'werks': widget.werks});

      final response = await http.get(uri);
      final body = jsonDecode(response.body);

      if (response.statusCode != 200 || body['success'] != true) {
        setState(() {
          _error = body['error'] ?? 'Failed to load work orders';
          _isLoading = false;
        });
        return;
      }

      setState(() {
        _workorders = body['data'] ?? [];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Widget _statusBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(text, style: TextStyle(color: color, fontSize: 12)),
    );
  }
Widget _row(String label, String? value) {
  return Padding(
    padding: const EdgeInsets.only(bottom: 6),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 110,
          child: Text(
            '$label :',
            style: const TextStyle(
              fontWeight: FontWeight.bold,   // ✅ LEFT SIDE BOLD
            ),
          ),
        ),
        Expanded(
          child: Text(value ?? '-'),
        ),
      ],
    ),
  );
}

  Widget _workOrderCard(dynamic item) {
    return Card(
      elevation: 5,
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              item['Ktext'] ?? 'Work Order',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 10),
            _row('Order No', item['Aufnr']),
            _row('Plant', item['Werks']),
            _row('Type', item['Auart']),
            _row('Company', item['Bukrs']),
            _row('Cost Ctr', item['Kostl']),
            _row('Created', item['Erdat']),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                if (item['Phas0'] == 'X') _statusBadge('Created', Colors.grey),
                if (item['Phas1'] == 'X') _statusBadge('Released', Colors.blue),
                if (item['Phas2'] == 'X') _statusBadge('Completed', Colors.green),
                if (item['Phas3'] == 'X') _statusBadge('Closed', Colors.purple),
              ],
            )
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      /// ✅ STATIC NAV BAR (UNCHANGED)
      // appBar: AppBar(
      //   backgroundColor: const Color(0xFF2E3440),
      //   title: const Text('Work Orders'),
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

  title: const Text('Work Orders'),
),

      body: Container(
        padding: const EdgeInsets.all(16),
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
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(child: Text(_error!))
                : _workorders.isEmpty
                    ? const Center(child: Text('No work orders found'))
                    : ListView.builder(
                        itemCount: _workorders.length,
                        itemBuilder: (context, index) {
                          return _workOrderCard(_workorders[index]);
                        },
                      ),
      ),
    );
  }
}
