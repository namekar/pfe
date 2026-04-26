// PocketWatch/hooks/useVetNews.js

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { generateMockNews, categorizeByRelevance } from '../lib/newsSources';

export const useVetNews = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedArticles, setSavedArticles] = useState([]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data directly - NO API CALL
      let newsData = generateMockNews();
      setNews(newsData);
      
      // Load saved articles from storage
      loadSavedArticles();
    } catch (error) {
      console.error('Error fetching news:', error);
      Alert.alert('Error', 'Failed to load veterinary news');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSavedArticles = async () => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('savedArticles');
        if (saved) {
          setSavedArticles(JSON.parse(saved));
        }
      }
    } catch (error) {
      console.error('Error loading saved articles:', error);
    }
  };

  const saveArticle = async (articleId) => {
    try {
      let updated = [...savedArticles];
      if (updated.includes(articleId)) {
        updated = updated.filter(id => id !== articleId);
      } else {
        updated.push(articleId);
      }
      
      setSavedArticles(updated);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedArticles', JSON.stringify(updated));
      }
      
      Alert.alert('Success', updated.includes(articleId) ? 'Article saved!' : 'Article removed');
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const shareArticle = async (article) => {
    Alert.alert('Share', `Sharing: ${article.title}`);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  }, [fetchNews]);

  // Filter news based on category and search
  useEffect(() => {
    let filtered = [...news];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query)
      );
    }
    
    setFilteredNews(filtered);
  }, [news, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news: filteredNews,
    allNews: news,
    loading,
    refreshing,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    savedArticles,
    saveArticle,
    shareArticle,
    onRefresh
  };
};