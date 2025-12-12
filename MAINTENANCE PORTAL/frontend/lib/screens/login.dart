import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dashboard.dart';

class LoginScreen extends StatefulWidget {
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _engineerIdController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _isLoading = false;
  String? _error;

  static const String _baseUrl = 'http://localhost:3000';

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    final engineerId = _engineerIdController.text.trim();
    final password = _passwordController.text.trim();

    if (engineerId.isEmpty || password.isEmpty) {
      setState(() {
        _error = 'Engineer ID and Password are required';
        _isLoading = false;
      });
      return;
    }

    try {
      final uri = Uri.parse(
        '$_baseUrl/api/login?engineerId=$engineerId&password=$password',
      );

      final response = await http.get(uri);
      final body = jsonDecode(response.body);

      if (response.statusCode != 200 || body['success'] != true) {
        setState(() {
          _error = body['error'] ?? 'Login failed';
          _isLoading = false;
        });
        return;
      }

      if (body['data']['Status'] == 'S') {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => DashboardScreen(engineerId: engineerId),
          ),
        );
      } else {
        setState(() {
          _error = body['data']['StatusMsg'] ?? 'Invalid login';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Login failed';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _engineerIdController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,

        /// ✅ SAME GRADIENT AS DASHBOARD
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

        child: Center(
          child: Card(
            elevation: 18,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(28),
            ),
            child: Container(
              width: 380,
              padding: const EdgeInsets.all(28),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  /// ✅ HEADER ICON
                  CircleAvatar(
                    radius: 34,
                    backgroundColor: Colors.grey.shade200,
                    child: const Icon(
                      Icons.engineering,
                      size: 36,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 20),

                  /// ✅ TITLE
                  const Text(
                    'Maintenance Portal',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 30),

                  /// ✅ ENGINEER ID
                  // TextField(
                  //   controller: _engineerIdController,
                  //   decoration: InputDecoration(
                  //     labelText: 'Engineer ID',
                  //     border: OutlineInputBorder(
                  //       borderRadius: BorderRadius.circular(14),
                  //     ),
                  //   ),
                  // ),
                  TextField(
  controller: _engineerIdController,
  style: const TextStyle(color: Colors.black), // ✅ input text black
  decoration: InputDecoration(
    labelText: 'Engineer ID',
    labelStyle: const TextStyle(color: Colors.black), // ✅ label black
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
    ),
  ),
),

                  const SizedBox(height: 18),

                  /// ✅ PASSWORD
                  // TextField(
                  //   controller: _passwordController,
                  //   obscureText: true,
                  //   decoration: InputDecoration(
                  //     labelText: 'Password',
                  //     border: OutlineInputBorder(
                  //       borderRadius: BorderRadius.circular(14),
                  //     ),
                  //   ),
                  // ),
                  TextField(
  controller: _passwordController,
  obscureText: true,
  style: const TextStyle(color: Colors.black), // ✅ input text black
  decoration: InputDecoration(
    labelText: 'Password',
    labelStyle: const TextStyle(color: Colors.black), // ✅ label black
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
    ),
  ),
),


                  const SizedBox(height: 16),

                  if (_error != null)
                    Text(
                      _error!,
                      style: const TextStyle(color: Colors.red),
                    ),

                  const SizedBox(height: 22),

                  /// ✅ LOGIN BUTTON (MATCH NAV BAR COLOR)
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _login,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2E3440),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: _isLoading
                          ? const CircularProgressIndicator(
                              color: Colors.white,
                            )
                          : const Text(
                              'Login',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.white, // ✅
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                    ),
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}