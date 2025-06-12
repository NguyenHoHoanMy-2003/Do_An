import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../styles/ContractView.scss";
import ApproveContractButton from '../components/ApproveContractButton';

function ContractView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUser = useSelector(state => state.user?.user);
    const ishost = currentUser?.role === 'host';

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const response = await fetch(`http://localhost:5001/contracts/${id}`);
                if (!response.ok) {
                    throw new Error('Không tìm thấy hợp đồng');
                }
                const data = await response.json();
                setContract(data.contract);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContract();
    }, [id]);

    if (loading) {
        return <div className="loading">Đang tải hợp đồng...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!contract) {
        return <div className="error">Không tìm thấy hợp đồng</div>;
    }

    return (
        <div className="contract-view">
            <div className="contract-actions">
                <button onClick={() => window.print()} className="print-btn">
                    In hợp đồng
                </button>
                <button onClick={() => navigate('/contracts')} className="back-btn">
                    Quay lại
                </button>
            </div>
            <div 
                className="contract-content"
                dangerouslySetInnerHTML={{ __html: contract.contract_html_content }}
            />
            {ishost && contract.status === 'pending_host_approval' && (
                <div className="approval-section">
                    <ApproveContractButton 
                        contractId={contract.id_contract}
                        onApprove={() => {
                            setContract(prev => ({
                                ...prev,
                                status: 'signed'
                            }));
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default ContractView; 