const axios = require('axios');

async function getAccessToken() {
    try {
        const response = await axios.post('https://api.rd.services/auth/token', {
            client_id: process.env.RD_CLIENT_ID,
            client_secret: process.env.RD_CLIENT_SECRET,
            refresh_token: process.env.RD_REFRESH_TOKEN,
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Erro ao renovar token:', error.response?.data || error.message);
        return null;
    }
}

exports.handler = async (event) => {
    try {
        console.log("Função chamada para enviar dados para RD Station");

        const payload = JSON.parse(event.body);

        console.log('RD_API_URL:', process.env.RD_API_URL);
        
        // Obtém um novo access_token usando o refresh_token
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Erro ao obter token de acesso' }),
            };
        }

        // Envia os dados para a RD Station
        const response = await axios.post(process.env.RD_API_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        console.log("Resposta da RD Station:", response.data);

        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        console.error('Erro ao enviar para RD Station:', error.response?.data || error.message);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao enviar para RD Station' }),
        };
    }
};