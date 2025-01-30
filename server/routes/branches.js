import express from "express";

const router = express.Router();

router.get("/allBranches", async (req, res) => {
    try {
        const response = await fetch("https://api.ocbc.com/branch_locator/1.1", {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer eyJ4NXQiOiJOREU1WXpjeFpEbGlNV1F6TXprd1ltVTJOekptWXpVMU5XRXhOVFkzWVRFME1EUm1OalE0WXciLCJraWQiOiJZVFJsTVRWbU16TTNNR1V6TVRsak4yTTFNamRtWlRCak5Ua3pNV0V4T0RjNE56VXlaVGd4WlRKallqWmlOek16WldRM1ltWXpNR1U0WTJGa01qa3hOZ19SUzI1NiIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJrb2hjdDEiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6IlA3N21VYTlIZ1IwWDhUX1FzMzBRZjF4TWpUTWEiLCJuYmYiOjE3MzY0OTM4NjgsImF6cCI6IlA3N21VYTlIZ1IwWDhUX1FzMzBRZjF4TWpUTWEiLCJzY29wZSI6ImRlZmF1bHQiLCJpc3MiOiJodHRwczpcL1wvYXBpLm9jYmMuY29tXC9vYXV0aDJcL3Rva2VuIiwiZXhwIjoxNzM2NDk0NzY4LCJpYXQiOjE3MzY0OTM4NjgsImp0aSI6IjU0MjNhNDZmLTVmYmMtNDI3Ny05Njc3LWZjNWIxNDgxOTMxNCJ9.qBmN_jncU-4rnCtcPQBYBv_aqbYRKje8kGXD0CdZM0P8ebXG0I5J-V1SRh0KxYytPTu_G4v4PfSU7g-B33A2w3AmuNgpIKrxafg61WVDG749VaSNEiiEW3W4RaaK4FQBQy-TC3GWUxJGhkrYyhmwC6hYKr5SI8Qr4KYPGjDr5S-PubaVcZRMnturbj1TNHLrXcxKtFZWCvOEzMeP9oymAuS-pJR3FSkt3ANYzB8n-A2fKrua8uYXd4Mo-agOA1k26o1Hr2LSUPps6iJB97BX73RLiz1yCdRMxap0dO0ZhpHquSwgFw3dMkpLnHz5x3r3RpGUG6MXSPt3ftMtuXoRaw"
            }
        });

        const result = await response.json();
        res.status(200).send(result);
    } catch(err) {
        console.log(err);
    }
});

export default router;
