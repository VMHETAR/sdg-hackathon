import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const mockStudentData = {
  "Marital status": 1,
  "Application mode": 17,
  "Application order": 1,
  "Course": 9254,
  "Daytime/evening attendance": 1,
  "Previous qualification": 1,
  "Previous qualification (grade)": 122,
  "Nacionality": 1,
  "Mother's qualification": 13,
  "Father's qualification": 27,
  "Mother's occupation": 10,
  "Father's occupation": 10,
  "Admission grade": 126,
  "Displaced": 1,
  "Educational special needs": 0,
  "Debtor": 0,
  "Tuition fees up to date": 1,
  "Gender": 1,
  "Scholarship holder": 0,
  "Age at enrollment": 19,
  "International": 0,
  "Curricular units 1st sem (credited)": 0,
  "Curricular units 1st sem (enrolled)": 6,
  "Curricular units 1st sem (evaluations)": 6,
  "Curricular units 1st sem (approved)": 5,
  "Curricular units 1st sem (grade)": 13,
  "Curricular units 1st sem (without evaluations)": 0,
  "Curricular units 2nd sem (credited)": 0,
  "Curricular units 2nd sem (enrolled)": 6,
  "Curricular units 2nd sem (evaluations)": 6,
  "Curricular units 2nd sem (approved)": 5,
  "Curricular units 2nd sem (grade)": 12,
  "Curricular units 2nd sem (without evaluations)": 0,
  "Unemployment rate": 9.4,
  "Inflation rate": 1.2,
  "GDP": 1.74
};

const semesterTrend = [
  { name: "Sem 1", grade: 13 },
  { name: "Sem 2", grade: 12 },
  { name: "Sem 3", grade: 11 },
  { name: "Sem 4", grade: 10 }
];

const teacherStudents = [
  { name: "Rahul Sharma", risk: 0.72 },
  { name: "Anita Patel", risk: 0.41 },
  { name: "Vikram Singh", risk: 0.18 }
];

export default function EduRetainApp() {
  const [role, setRole] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [risk, setRisk] = useState(null);

  const login = (selectedRole) => {
    setRole(selectedRole);
    setLoggedIn(true);
  };

  const predictRisk = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockStudentData)
      });

      const data = await res.json();
      setRisk(data);
    } catch (err) {
      console.error(err);
      alert("API not running");
    }
  };

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-8">
        <h1 className="text-4xl font-bold">EduRetain</h1>
        <p className="text-gray-500">Early Warning Dropout Prevention System</p>

        <div className="flex gap-6">
          <Button onClick={() => login("teacher")}>Teacher Login</Button>
          <Button onClick={() => login("student")}>Student Login</Button>
        </div>
      </div>
    );
  }

  if (role === "teacher") {
    return (
      <div className="p-10 space-y-8">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>

        <div className="grid grid-cols-3 gap-6">
          {teacherStudents.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">{s.name}</h2>
                <p className="mt-2">Risk Score: {(s.risk * 100).toFixed(1)}%</p>
                <p>
                  Status: {s.risk > 0.6 ? "High Risk" : s.risk > 0.3 ? "Medium Risk" : "Low Risk"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Button onClick={predictRisk}>Run AI Analysis</Button>
        </div>

        {risk && (
          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Prediction Result</h2>
              <p>Risk Score: {(risk.dropout_risk_score * 100).toFixed(2)}%</p>
              <p>Risk Level: {risk.risk_level}</p>

              <div className="mt-4">
                <h3 className="font-semibold">Suggested Intervention</h3>
                <ul className="list-disc ml-5 text-sm">
                  <li>Schedule academic counseling</li>
                  <li>Recommend peer tutoring</li>
                  <li>Monitor assignment submissions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (role === "student") {
    return (
      <div className="p-10 space-y-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>

        <Button onClick={predictRisk}>Check My Academic Risk</Button>

        {risk && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">Your Risk Analysis</h2>
              <p className="mt-2">Risk Score: {(risk.dropout_risk_score * 100).toFixed(2)}%</p>
              <p>Status: {risk.risk_level}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Academic Performance Trend</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={semesterTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="grade" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}