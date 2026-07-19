import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MainTab } from '../App';

type Props = {
  activeTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
};

const tabs: Array<{ key: MainTab; label: string }> = [
  { key: 'rest', label: 'REST' },
  { key: 'secrets', label: 'Secretos' },
  { key: 'persistence', label: 'Persistencia' },
];

export function TopTabs({ activeTab, onChangeTab }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Red y Seguridad</Text>
      <Text style={styles.subtitle}>JSONPlaceholder, secretos nativos y persistencia dual</Text>
      <View style={styles.row}>
        {tabs.map((tab) => {
          const selected = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onChangeTab(tab.key)}
              style={[styles.tab, selected ? styles.tabSelected : null]}
            >
              <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#0f172a',
  },
  title: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#cbd5e1',
    marginTop: 4,
    marginBottom: 14,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabSelected: {
    backgroundColor: '#38bdf8',
  },
  tabText: {
    color: '#e2e8f0',
    fontWeight: '700',
    fontSize: 12,
  },
  tabTextSelected: {
    color: '#082f49',
  },
});
