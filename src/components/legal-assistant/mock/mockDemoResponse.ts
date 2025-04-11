
/**
 * Mock demo responses for the Legal Assistant demo feature
 */

export const mockDemoResponse = (demoType: string): string => {
  switch (demoType) {
    case "contract":
      return `
        <div>
          <h3 class="text-xl font-bold mb-4">Contract Analysis</h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold">Contract Type</h4>
              <p>Residential Lease Agreement</p>
            </div>
            <div>
              <h4 class="font-semibold">Parties</h4>
              <p>Landlord: ABC Properties LLC</p>
              <p>Tenant: John Doe</p>
            </div>
            <div>
              <h4 class="font-semibold">Key Terms</h4>
              <ul class="list-disc ml-5">
                <li>Lease Term: 12 months (Jan 1, 2025 - Dec 31, 2025)</li>
                <li>Monthly Rent: $1,500 due on the 1st of each month</li>
                <li>Security Deposit: $2,000</li>
                <li>Late Fee: $50 after 5-day grace period</li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold">Key Clauses</h4>
              <ul class="list-disc ml-5">
                <li>No subletting without landlord approval</li>
                <li>Tenant responsible for utilities (electricity, water, internet)</li>
                <li>Pets allowed with $300 non-refundable pet deposit</li>
                <li>Maintenance requests must be submitted in writing</li>
                <li>30-day notice required for termination</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    case "risk":
      return `
        <div>
          <h3 class="text-xl font-bold mb-4">Risk Analysis for Tenant</h3>
          <div class="space-y-4">
            <div class="p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <h4 class="font-semibold text-yellow-700">Medium Risk: Early Termination Penalties</h4>
              <p>The contract includes significant penalties for early termination (2 months rent). Consider negotiating this term if you anticipate any potential need to relocate before the lease ends.</p>
            </div>
            <div class="p-4 bg-red-50 border-l-4 border-red-400">
              <h4 class="font-semibold text-red-700">High Risk: Property Condition Documentation</h4>
              <p>There is no clause requiring the landlord to document the property condition before move-in. This could lead to disputes about the security deposit upon move-out. Request a move-in inspection checklist.</p>
            </div>
            <div class="p-4 bg-green-50 border-l-4 border-green-400">
              <h4 class="font-semibold text-green-700">Low Risk: Maintenance Responsibilities</h4>
              <p>The contract clearly defines maintenance responsibilities with the landlord responsible for structural repairs and major systems.</p>
            </div>
            <div class="p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <h4 class="font-semibold text-yellow-700">Medium Risk: Automatic Renewal Clause</h4>
              <p>The lease automatically renews unless canceled 60 days before the end date. Set a reminder to review the lease terms well before this deadline.</p>
            </div>
          </div>
        </div>
      `;
    default:
      return `
        <div>
          <h3 class="text-xl font-bold mb-4">Document Analysis</h3>
          <p>This is a sample analysis of a legal document. Select a specific demo type to see more detailed analysis.</p>
        </div>
      `;
  }
};
