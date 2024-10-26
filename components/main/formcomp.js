"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';

import question from "@/app/data/data.json";
import { useRouter } from 'next/navigation'
import "./Modal.css";

export default function MultiStepForm() {
    const [step, setStep] = useState(1);
    const [responses, setResponses] = useState({});

    const Questions = question.questions;
    const nextStep = () => setStep((prev) => Math.min(prev + 1, Questions.length));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
    const router = useRouter()
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
    };

    useEffect(() => {
        if (modal) {
            document.body.classList.add('active-modal');
        } else {
            document.body.classList.remove('active-modal');
        }

        // Cleanup function to remove class if the component is unmounted
        return () => document.body.classList.remove('active-modal');
    }, [modal]);
    const progress = (step / Questions.length) * 100;

    // Handle input change and update the response state per question and step
    const handleInputChange = (index, value) => {
        setResponses({
            ...responses,
            [step]: {
                ...(responses[step] || {}),
                [index]: value,
            },
        });
    };

    const handleSubmit = () => {
        console.log("Collected Responses:", responses);
        // Process or send the collected responses as needed
    };

    return (
        <div className="w-1/2 p-6 bg-neutral-800 rounded-lg shadow-lg">
            <form onSubmit={(e) => {
                e.preventDefault();
                if (step === Questions.length) {
                    handleSubmit();


                }
            }}>
                {Questions[step - 1] && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">{Questions[step - 1].title}</h2>
                        <div className="relative w-full h-2 bg-gray-50/50 rounded mt-4 overflow-hidden mb-8">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-violet-500 rounded"
                            />
                        </div>

                        {Questions[step - 1].questionlabels.map((question, index) => (
                            <div key={index} className="">
                                <label className="block mb-2 font-semibold text-sm">{question}</label>
                                <input
                                    type="text"
                                    placeholder=""
                                    className="w-full p-2 outline-none bg-neutral-700 focus:bg-violet-500/30 duration-300 rounded text-sm mb-4"
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    value={responses[step]?.[index] || ""}

                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="w-full flex justify-between mt-6 mb-6">
                    <button
                        type="button"
                        onClick={prevStep}
                        className={"bg-transparent w-1/ text-white rounded hover:text-violet-200 duration-300 underline-offset-1" + (step === 1 ? " hidden" : "")}
                    >
                        <p className="underline underline-offset-4">Back</p>
                    </button>

                    <button
                        type={step === Questions.length ? "submit" : "button"}
                        onClick={step === Questions.length ? toggleModal : nextStep}
                        className={"px-12 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 duration-300" + (step === 1 ? " ml-auto" : "")}
                    >
                        {step === Questions.length ? "Submit" : "Next"}
                    </button>
                    {modal && (
                        <div className="modal ">
                            <div onClick={toggleModal} className="overlay"></div>
                            <div className="modal-content bg-neutral-800 ">
                                <p className="mt-6 mb-4 text-center">Are you sure you want to submit this journal entry?</p>
                                <div className="flex justify-center mb-6 mt-8">
                                    <button onClick={toggleModal} className="px-6 p-2 mr-3 bg-neutral-700 rounded-md hover:bg-neutral-600  duration-500">
                                        Close
                                    </button>
                                    <button onClick={() => router.push('/')} className="px-6 p-2 rounded-md bg-violet-600 hover:bg-violet-700  duration-500 ">
                                        Confirm
                                    </button></div>
                            </div>
                        </div>
                    )}
                </div>
            </form >
        </div >
    );
}
