import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout';
import MachineInput from '../components/MachineInput';
import DrillcodePrompt from '../components/DrillcodePrompt';
ReactDOM.render(
    <Layout>
        <MachineInput/>
        <DrillcodePrompt/>
    </Layout>,
    document.getElementById('root')
);