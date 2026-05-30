// API Service wrapper using native fetch
const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

export const api = {
  // 1. Auth Endpoint
  auth: {
    register: (name, email, password) => 
      fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password })
      }).then(handleResponse),

    login: (email, password) => 
      fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
      }).then(handleResponse),

    googleLogin: (name, email, googleId, profilePic) => 
      fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, googleId, profilePic })
      }).then(handleResponse),

    getMe: () => 
      fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: getHeaders()
      }).then(handleResponse),

    updateProfile: (profileData) => 
      fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData)
      }).then(handleResponse)
  },

  // 2. Resume Endpoint
  resume: {
    analyze: (file) => {
      const formData = new FormData();
      formData.append('resume', file);
      
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      return fetch(`${API_BASE}/resume/analyze`, {
        method: 'POST',
        headers,
        body: formData
      }).then(handleResponse);
    }
  },

  // 3. Mock Interviews Endpoint
  interviews: {
    start: (category, difficulty) => 
      fetch(`${API_BASE}/interviews/start`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ category, difficulty })
      }).then(handleResponse),

    answer: (interviewId, answerText, speechAnalysis, webcamAnalysis) => 
      fetch(`${API_BASE}/interviews/answer`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ interviewId, answerText, speechAnalysis, webcamAnalysis })
      }).then(handleResponse),

    end: (interviewId, finalSpeechAnalysis) => 
      fetch(`${API_BASE}/interviews/end`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ interviewId, finalSpeechAnalysis })
      }).then(handleResponse),

    getHistory: () => 
      fetch(`${API_BASE}/interviews/history`, {
        method: 'GET',
        headers: getHeaders()
      }).then(handleResponse)
  },

  // 4. Coding Endpoint
  coding: {
    getChallenges: () => 
      fetch(`${API_BASE}/coding/challenges`, {
        method: 'GET',
        headers: getHeaders()
      }).then(handleResponse),

    execute: (challengeId, code, language) => 
      fetch(`${API_BASE}/coding/execute`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ challengeId, code, language })
      }).then(handleResponse),

    submit: (challengeId, code, language, score, passed, total) => 
      fetch(`${API_BASE}/coding/submit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ challengeId, code, language, score, passed, total })
      }).then(handleResponse)
  },

  // 5. Aptitude Endpoint
  aptitude: {
    getQuestions: (category) => 
      fetch(`${API_BASE}/aptitude/questions?category=${category || ''}`, {
        method: 'GET',
        headers: getHeaders()
      }).then(handleResponse),

    submit: (category, score, totalQuestions, answers) => 
      fetch(`${API_BASE}/aptitude/submit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ category, score, totalQuestions, answers })
      }).then(handleResponse)
  },

  // 6. Study Plan Endpoint
  studyPlan: {
    get: () => 
      fetch(`${API_BASE}/studyplan`, {
        method: 'GET',
        headers: getHeaders()
      }).then(handleResponse),

    regenerate: () => 
      fetch(`${API_BASE}/studyplan/regenerate`, {
        method: 'POST',
        headers: getHeaders()
      }).then(handleResponse),

    toggleTask: (taskText) => 
      fetch(`${API_BASE}/studyplan/toggle`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ taskText })
      }).then(handleResponse)
  },

  // 7. Admin Endpoint
  admin: {
    getStats: () => 
      fetch(`${API_BASE}/admin/stats`, {
        method: 'GET',
        headers: getHeaders()
      }).then(handleResponse),

    getUsers: () => 
      fetch(`${API_BASE}/admin/users`, {
        method: 'GET',
        headers: getHeaders()
      }).then(handleResponse)
  }
};
