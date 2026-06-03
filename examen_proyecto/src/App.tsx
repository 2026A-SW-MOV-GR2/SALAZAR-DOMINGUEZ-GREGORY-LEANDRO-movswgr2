import React, {useMemo, useState} from 'react';
import {Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {theme} from './theme';
import {HybridPersistenceScreen} from './features/dual/HybridPersistenceScreen';
import {RestScreen} from './features/rest/RestScreen';
import {SecretsScreen} from './features/secrets/SecretsScreen';

type SectionKey = 'rest' | 'secrets' | 'persistence';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>('rest');

  const section = useMemo(() => {
    switch (activeSection) {
      case 'rest':
        return <RestScreen />;
      case 'secrets':
        return <SecretsScreen />;
      case 'persistence':
        return <HybridPersistenceScreen />;
    }
  }, [activeSection]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Proyecto Red y Seguridad</Text>
        <Text style={styles.subtitle}>React Native desde cero</Text>
      </View>

      <View style={styles.tabRow}>
        <TabButton label="REST" active={activeSection === 'rest'} onPress={() => setActiveSection('rest')} />
        <TabButton label="Secretos" active={activeSection === 'secrets'} onPress={() => setActiveSection('secrets')} />
        <TabButton
          label="Persistencia dual"
          active={activeSection === 'persistence'}
          onPress={() => setActiveSection('persistence')}
        />
      </View>

      <View style={styles.content}>{section}</View>
    </SafeAreaView>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.colors.muted,
    marginTop: 4,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#001018',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});