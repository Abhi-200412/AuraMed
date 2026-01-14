'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Bell, Shield, Palette, Globe, Moon, Sun } from 'lucide-react';

export default function PatientSettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-06-15',
    address: '123 Main St, Anytown, ST 12345',
    notifications: {
      email: true,
      sms: true,
      push: true,
      appointmentReminders: true,
      testResults: true,
      doctorMessages: true
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      researchConsent: false
    },
    appearance: {
      theme: 'dark',
      language: 'en'
    }
  });

  const handleSave = () => {
    // In a real app, this would save to a database
    console.log('Saving settings:', formData);
    alert('Settings saved successfully!');
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-text-secondary mt-2">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <div className="glass rounded-xl p-4 border border-white/5">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-secondary/10 text-secondary'
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6 border border-white/5"
          >
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-surface-light border border-white/10 text-text-primary focus:border-secondary outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-surface-light border border-white/10 text-text-primary focus:border-secondary outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-surface-light border border-white/10 text-text-primary focus:border-secondary outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-surface-light border border-white/10 text-text-primary focus:border-secondary outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-surface-light border border-white/10 text-text-primary focus:border-secondary outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-surface-light border border-white/10 text-text-primary focus:border-secondary outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light/50">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-text-secondary">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          notifications: {...formData.notifications, email: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light/50">
                    <div>
                      <h3 className="font-medium">SMS Notifications</h3>
                      <p className="text-sm text-text-secondary">Receive text messages</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.sms}
                        onChange={(e) => setFormData({
                          ...formData,
                          notifications: {...formData.notifications, sms: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light/50">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-text-secondary">Receive in-app notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.push}
                        onChange={(e) => setFormData({
                          ...formData,
                          notifications: {...formData.notifications, push: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="font-medium mb-4">Specific Notifications</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Appointment Reminders</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifications.appointmentReminders}
                            onChange={(e) => setFormData({
                              ...formData,
                              notifications: {...formData.notifications, appointmentReminders: e.target.checked}
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Test Results</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifications.testResults}
                            onChange={(e) => setFormData({
                              ...formData,
                              notifications: {...formData.notifications, testResults: e.target.checked}
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Doctor Messages</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifications.doctorMessages}
                            onChange={(e) => setFormData({
                              ...formData,
                              notifications: {...formData.notifications, doctorMessages: e.target.checked}
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">Profile Visibility</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-surface-light/50 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="private"
                          checked={formData.privacy.profileVisibility === 'private'}
                          onChange={(e) => setFormData({
                            ...formData,
                            privacy: {...formData.privacy, profileVisibility: e.target.value}
                          })}
                          className="text-secondary focus:ring-secondary"
                        />
                        <div>
                          <span className="font-medium">Private</span>
                          <p className="text-sm text-text-secondary">Only you and your doctors can see your profile</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-surface-light/50 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="limited"
                          checked={formData.privacy.profileVisibility === 'limited'}
                          onChange={(e) => setFormData({
                            ...formData,
                            privacy: {...formData.privacy, profileVisibility: e.target.value}
                          })}
                          className="text-secondary focus:ring-secondary"
                        />
                        <div>
                          <span className="font-medium">Limited</span>
                          <p className="text-sm text-text-secondary">Healthcare providers can see basic information</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="font-medium mb-3">Data Sharing</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light/50">
                        <div>
                          <h4 className="font-medium">Share anonymized data for research</h4>
                          <p className="text-sm text-text-secondary">Help advance medical research with your anonymized health data</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.privacy.researchConsent}
                            onChange={(e) => setFormData({
                              ...formData,
                              privacy: {...formData.privacy, researchConsent: e.target.checked}
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Appearance</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          appearance: {...formData.appearance, theme: 'light'}
                        })}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          formData.appearance.theme === 'light'
                            ? 'border-secondary bg-secondary/10'
                            : 'border-white/10 bg-surface-light hover:bg-surface'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sun size={18} />
                          <span className="font-medium">Light</span>
                        </div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </button>
                      
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          appearance: {...formData.appearance, theme: 'dark'}
                        })}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          formData.appearance.theme === 'dark'
                            ? 'border-secondary bg-secondary/10'
                            : 'border-white/10 bg-surface-light hover:bg-surface'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Moon size={18} />
                          <span className="font-medium">Dark</span>
                        </div>
                        <div className="h-8 bg-gray-800 rounded"></div>
                      </button>
                      
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          appearance: {...formData.appearance, theme: 'auto'}
                        })}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          formData.appearance.theme === 'auto'
                            ? 'border-secondary bg-secondary/10'
                            : 'border-white/10 bg-surface-light hover:bg-surface'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Globe size={18} />
                          <span className="font-medium">Auto</span>
                        </div>
                        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-800 rounded"></div>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Language</h3>
                    <select
                      value={formData.appearance.language}
                      onChange={(e) => setFormData({
                        ...formData,
                        appearance: {...formData.appearance, language: e.target.value}
                      })}
                      className="w-full max-w-xs px-4 py-2 rounded-lg bg-surface-light border border-white/10 text-text-primary focus:border-secondary outline-none transition-colors"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-8">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}