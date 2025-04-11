
/**
 * Mock demo responses for the Legal Assistant demo feature
 */

export const mockDemoResponse = (demoType: string): string => {
  switch (demoType) {
    case "contract":
      return `
        <title>Non-Disclosure Agreement Analysis</title>

        <h1>Non-Disclosure Agreement Analysis</h1>

        <h2>Sections</h2>

        <ol>
          <li>Parties</li>
          <li>Confidential Information</li>
          <li>Return of Confidential Information</li>
          <li>Ownership</li>
          <li>Governing Law</li>
          <li>Signature and Date</li>
        </ol>

        <h2>Section Summaries</h2>

        <h3>1. Parties</h3>
          <ul>
            <li><span class="legal">**Legal Summary:** This section identifies the contracting entities, specifying their legal names and addresses. It establishes the Disclosing Party, who owns the confidential information, and the Receiving Party, obligated to maintain its secrecy. The Effective Date, although not explicitly filled, is a critical trigger for the agreement's enforcement.</span></li>
            <li><span class="layman">**Layman's Summary:** Think of this like the introduction of the main characters in a story. It tells us who is involved (the Disclosing Party, the one sharing secrets, and the Receiving Party, the one promising to keep them) and their addresses. The Effective Date is when the agreement officially starts, like the start of a movie.</span></li>
          </ul>

        <h3>2. Confidential Information</h3>
          <ul>
            <li><span class="legal">**Legal Summary:** This section defines the scope of protected information. It prohibits the Receiving Party from disclosing, copying, cloning, modifying, or using the Disclosing Party's confidential information without prior consent. 'Confidential information' encompasses a broad range of data, including, but not limited to, business strategies, customer lists, and proprietary processes. The clause aims to prevent the unauthorized dissemination or exploitation of sensitive business assets.</span></li>
            <li><span class="layman">**Layman's Summary:** This section explains what's considered a secret. It says the Receiving Party can't share or misuse anything the Disclosing Party tells them. This includes all sorts of information, like secret recipes, customer lists, or how a company does its work. It's like promising to keep the secret ingredient a secret.</span></li>
          </ul>

        <h3>3. Return of Confidential Information</h3>
          <ul>
            <li><span class="legal">**Legal Summary:** This clause mandates that, upon termination of the agreement, the Receiving Party must return all confidential information to the Disclosing Party. This is a critical provision to safeguard the Disclosing Party's intellectual property and trade secrets after the relationship ends. This limits how long the Receiving Party has access to the confidential information.</span></li>
            <li><span class="layman">**Layman's Summary:** This part says that when the agreement is over, the Receiving Party has to give back all the secret information. It's like returning a borrowed book – you don't get to keep it.</span></li>
          </ul>

        <h3>4. Ownership</h3>
          <ul>
            <li><span class="legal">**Legal Summary:** This section clarifies that the agreement is non-transferable, meaning neither party can assign their rights or obligations to a third party without the written consent of the other party. This prevents the agreement from being unilaterally transferred or sold.</span></li>
            <li><span class="layman">**Layman's Summary:** This section says that neither party can pass the agreement on to someone else. It's like a personal contract - you can't let someone else take your place without the other person's permission.</span></li>
          </ul>

        <h3>5. Governing Law</h3>
          <ul>
            <li><span class="legal">**Legal Summary:** This clause specifies the jurisdiction whose laws will govern the interpretation and enforcement of the agreement. The law selected will be the basis for resolving any disputes or litigations arising under the agreement. The placeholder requires the specific jurisdiction to be identified.</span></li>
            <li><span class="layman">**Layman's Summary:** This section determines which country's or state's laws will be used if there's a problem with the agreement. It's like saying "we'll play by the rules of [Country/State]".</span></li>
          </ul>

        <h3>6. Signature and Date</h3>
          <ul>
            <li><span class="legal">**Legal Summary:** This section provides space for the parties to indicate their agreement to the terms and conditions of the NDA. It serves as a formal declaration of intent to be bound by the agreement and provides the date of execution.</span></li>
            <li><span class="layman">**Layman's Summary:** This is where everyone signs and dates the agreement, showing they've read it, understood it, and agree to follow its rules.</span></li>
          </ul>

        <h2>Report</h2>

        <p>This Non-Disclosure Agreement (NDA) is a legally binding contract designed to protect confidential information. The agreement defines the parties involved, specifies the types of information considered confidential, and sets forth obligations regarding its handling.</p>

        <p><b>Parties:</b> The NDA identifies the Disclosing Party (the one sharing the information) and the Receiving Party (the one receiving the information). The contract needs to be filled with the specific names and addresses of both the parties for the agreement to be valid.</p>

        <p><b>Confidential Information:</b> This section is crucial. It defines what information is protected. The NDA broadly defines confidential information as any data related to the Disclosing Party, in any form, including oral or written, such as business strategies, customer lists, and know-how. The Receiving Party is prohibited from disclosing, copying, cloning, modifying, or using this information without consent. It essentially acts as a shield, protecting the Disclosing Party's trade secrets and sensitive business data. It is designed to prevent any unauthorized use of such information that can cause business-related harm.</p>

        <p><b>Return of Confidential Information:</b> Upon termination of the agreement, the Receiving Party must return all confidential information to the Disclosing Party. This provision ensures that the Disclosing Party retains control over its proprietary data even after the business relationship ends.</p>

        <p><b>Ownership:</b> This section prevents either party from transferring the agreement to someone else without the other party's written consent. This ensures the original parties are the only ones bound by the NDA.</p>

        <p><b>Governing Law:</b> The laws of a specified jurisdiction will govern the interpretation and enforcement of the agreement. The blank space must be filled to specify the jurisdiction. This is important for resolving any disputes that may arise under the NDA. It tells us which country's laws are being used.</p>

        <p><b>Signatures and Date:</b> This is the final section where both parties sign and date the agreement, indicating their understanding and acceptance of the terms and conditions. The date is also important as this is the Effective Date that is the date the agreement officially starts.</p>

        <p><b>Key Implications:</b></p>

        <ul>
            <li><b>Enforceability:</b> The NDA provides legal recourse if the Receiving Party breaches the agreement, such as by disclosing the confidential information or using it in an unauthorized manner.</li>
            <li><b>Protection of Intellectual Property:</b> The agreement helps safeguard trade secrets, proprietary information, and other sensitive data from being disclosed to competitors or the public.</li>
            <li><b>Clarity and Scope:</b> The NDA helps to provide clear definitions and restrictions.</li>
        </ul>
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
