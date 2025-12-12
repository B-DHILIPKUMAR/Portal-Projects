import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class PlantListScreen extends StatefulWidget {
  const PlantListScreen({Key? key}) : super(key: key);

  @override
  State<PlantListScreen> createState() => _PlantListScreenState();
}

class _PlantListScreenState extends State<PlantListScreen> {
  bool _loading = true;
  String? _error;
  List<dynamic> _plants = [];

  // ✅ Change to 10.0.2.2 for Android emulator
  static const String _baseUrl = 'http://localhost:3000';

  @override
  void initState() {
    super.initState();
    _fetchPlants();
  }

  Future<void> _fetchPlants() async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl/api/plants'));
      final body = jsonDecode(response.body);

      if (body['success'] == true) {
        setState(() {
          _plants = body['data'];
          _loading = false;
        });
      } else {
        _error = body['error'];
        _loading = false;
      }
    } catch (e) {
      _error = e.toString();
      _loading = false;
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F6FA),

      /// ✅ STATIC NAV BAR (EXACT SAME AS DASHBOARD)
      // appBar: AppBar(
      //   backgroundColor: const Color(0xFF2E3440),
      //   title: const Text('Plant List'),
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

  title: const Text('Plant List'),
),

      body: Container(
        width: double.infinity,
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
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(
                    child: Text(
                      _error!,
                      style: const TextStyle(color: Colors.red),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(24),
                    itemCount: _plants.length,
                    itemBuilder: (context, index) {
                      final p = _plants[index];
                      return _plantCard(p);
                    },
                  ),
      ),
    );
  }

  /// ✅ SAP-STYLE PLANT CARD (MATCHES THEME)
  Widget _plantCard(dynamic p) {
    return Card(
      elevation: 8,
      margin: const EdgeInsets.only(bottom: 20),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: const [
                Icon(Icons.factory, color: Colors.black87),
                SizedBox(width: 10),
                Text(
                  'Plant Details',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                )
              ],
            ),

            const SizedBox(height: 14),

            _row('Plant Code', p['Werks']),
            _row('Plant Name', p['Name1']),
            _row('Engineer', p['MaintenanceEngineer']),
            _row('Street', p['Stras']),
            _row('City', p['Ort01']),
            _row('Region', p['Regio']),
            _row('Country', p['Land1']),
          ],
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
            width: 140,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value ?? '-',
              style: const TextStyle(fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }
}