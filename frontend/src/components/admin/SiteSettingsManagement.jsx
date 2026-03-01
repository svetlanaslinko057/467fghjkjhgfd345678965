/**
 * SiteSettingsManagement - Admin component for site settings
 * Manages header config, socials, phones
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSiteSettings, updateSiteSettings, defaultHeaderConfig } from '../../api/site';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { 
  Settings, Phone, Globe, Clock, Save, Plus, Trash2, 
  ToggleLeft, ToggleRight, RefreshCw
} from 'lucide-react';

const SOCIAL_TYPES = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'viber', label: 'Viber' },
];

export default function SiteSettingsManagement() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({ header: defaultHeaderConfig });

  // Fetch settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSiteSettings(token);
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Помилка завантаження налаштувань');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSiteSettings(token, settings);
      toast.success('Налаштування збережено!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  const updateHeader = (key, value) => {
    setSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        [key]: value
      }
    }));
  };

  const updatePhone = (index, value) => {
    const phones = [...(settings.header?.phones || [])];
    phones[index] = value;
    updateHeader('phones', phones);
  };

  const addPhone = () => {
    const phones = [...(settings.header?.phones || []), ''];
    updateHeader('phones', phones);
  };

  const removePhone = (index) => {
    const phones = (settings.header?.phones || []).filter((_, i) => i !== index);
    updateHeader('phones', phones);
  };

  const updateSocial = (index, field, value) => {
    const socials = [...(settings.header?.socials || [])];
    socials[index] = { ...socials[index], [field]: value };
    updateHeader('socials', socials);
  };

  const addSocial = () => {
    const socials = [...(settings.header?.socials || []), { type: 'telegram', url: '', enabled: true }];
    updateHeader('socials', socials);
  };

  const removeSocial = (index) => {
    const socials = (settings.header?.socials || []).filter((_, i) => i !== index);
    updateHeader('socials', socials);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const header = settings.header || defaultHeaderConfig;

  return (
    <div className="space-y-6" data-testid="site-settings-management">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Налаштування сайту
        </h2>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Збереження...' : 'Зберегти'}
        </Button>
      </div>

      {/* Topbar Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Верхня панель (Topbar)
        </h3>

        <div className="space-y-4">
          {/* Show Topbar Toggle */}
          <div className="flex items-center justify-between">
            <Label>Показувати верхню панель</Label>
            <button
              onClick={() => updateHeader('showTopbar', !header.showTopbar)}
              className="flex items-center gap-2"
            >
              {header.showTopbar ? (
                <ToggleRight className="w-10 h-10 text-green-600" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-gray-400" />
              )}
            </button>
          </div>

          {/* Topbar Style */}
          <div>
            <Label>Стиль панелі</Label>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => updateHeader('topbarStyle', 'dark')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  header.topbarStyle === 'dark' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Темний
              </button>
              <button
                onClick={() => updateHeader('topbarStyle', 'light')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  header.topbarStyle === 'light' 
                    ? 'bg-white border-2 border-blue-600 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Світлий
              </button>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Графік роботи
            </Label>
            <Input
              value={header.workingHours || ''}
              onChange={(e) => updateHeader('workingHours', e.target.value)}
              placeholder="Пн-Пт: 9:00-19:00, Сб: 10:00-17:00"
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      {/* Phone Numbers */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Телефони
        </h3>

        <div className="space-y-3">
          {(header.phones || []).map((phone, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={phone}
                onChange={(e) => updatePhone(index, e.target.value)}
                placeholder="050-247-41-61"
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => removePhone(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addPhone}>
            <Plus className="w-4 h-4 mr-2" />
            Додати телефон
          </Button>
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Соціальні мережі
        </h3>

        <div className="space-y-4">
          {(header.socials || []).map((social, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <select
                value={social.type}
                onChange={(e) => updateSocial(index, 'type', e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                {SOCIAL_TYPES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              
              <Input
                value={social.url}
                onChange={(e) => updateSocial(index, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-1"
              />
              
              <button
                onClick={() => updateSocial(index, 'enabled', !social.enabled)}
                className={`px-3 py-2 rounded-lg ${
                  social.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {social.enabled ? 'Увімкнено' : 'Вимкнено'}
              </button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => removeSocial(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          
          <Button variant="outline" onClick={addSocial}>
            <Plus className="w-4 h-4 mr-2" />
            Додати соцмережу
          </Button>
        </div>
      </Card>
    </div>
  );
}
