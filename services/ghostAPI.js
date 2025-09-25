const axios = require('axios');
const jwt = require('jsonwebtoken');

class GhostAPI {
  constructor() {
    this.adminAPIUrl = process.env.GHOST_ADMIN_API_URL;
    this.adminAPIKey = process.env.GHOST_ADMIN_API_KEY;
    
    if (!this.adminAPIUrl || !this.adminAPIKey) {
      throw new Error('Ghost Admin API URL and Key are required');
    }
  }

  // Generate JWT token for Ghost Admin API
  generateToken() {
    const [id, secret] = this.adminAPIKey.split(':');
    
    const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
      keyid: id,
      algorithm: 'HS256',
      expiresIn: '5m',
      audience: '/admin/'
    });

    return token;
  }

  // Get API headers with authentication
  getHeaders() {
    return {
      'Authorization': `Ghost ${this.generateToken()}`,
      'Content-Type': 'application/json',
      'Accept-Version': 'v5.0'
    };
  }

  // Get member by email
  async getMemberByEmail(email) {
    try {
      const response = await axios.get(
        `${this.adminAPIUrl}/members/?filter=email:${encodeURIComponent(email)}`,
        { headers: this.getHeaders() }
      );
      
      return response.data.members[0] || null;
    } catch (error) {
      console.error('Error fetching member:', error.response?.data || error.message);
      throw error;
    }
  }

  // Create new member
  async createMember(memberData) {
    try {
      const response = await axios.post(
        `${this.adminAPIUrl}/members/`,
        { members: [memberData] },
        { headers: this.getHeaders() }
      );
      
      return response.data.members[0];
    } catch (error) {
      console.error('Error creating member:', error.response?.data || error.message);
      throw error;
    }
  }

  // Update existing member
  async updateMember(memberId, updateData) {
    try {
      const response = await axios.put(
        `${this.adminAPIUrl}/members/${memberId}/`,
        { members: [updateData] },
        { headers: this.getHeaders() }
      );
      
      return response.data.members[0];
    } catch (error) {
      console.error('Error updating member:', error.response?.data || error.message);
      throw error;
    }
  }

  // Add specific tiers/products to a member (for paid subscriptions)
  async addMemberToTier(memberId, tierId) {
    try {
      // First get the current member data
      const member = await this.getMemberById(memberId);
      
      // Add the tier to existing tiers
      const currentTiers = member.tiers || [];
      const newTiers = [...currentTiers, { id: tierId }];
      
      const response = await axios.put(
        `${this.adminAPIUrl}/members/${memberId}/`,
        { 
          members: [{ 
            tiers: newTiers 
          }] 
        },
        { headers: this.getHeaders() }
      );
      
      return response.data.members[0];
    } catch (error) {
      console.error('Error adding member to tier:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get member by ID
  async getMemberById(memberId) {
    try {
      const response = await axios.get(
        `${this.adminAPIUrl}/members/${memberId}/`,
        { headers: this.getHeaders() }
      );
      
      return response.data.members[0];
    } catch (error) {
      console.error('Error fetching member by ID:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get all tiers/products
  async getTiers() {
    try {
      const response = await axios.get(
        `${this.adminAPIUrl}/tiers/`,
        { headers: this.getHeaders() }
      );
      
      return response.data.tiers;
    } catch (error) {
      console.error('Error fetching tiers:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new GhostAPI();
