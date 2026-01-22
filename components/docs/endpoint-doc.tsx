'use client';

import { useState } from 'react';
import { Copy, Check, Share2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type ParamType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum';

export interface ApiParameter {
  name: string;
  type: ParamType;
  required: boolean;
  description: string;
  enumValues?: string[];
  defaultValue?: string;
}

export interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  title: string;
  description: string;
  parameters: ApiParameter[];
  requestExample: Record<string, unknown>;
  responseExample: Record<string, unknown>;
}

// Method badge
function MethodBadge({ method }: { method: HttpMethod }) {
  const colors: Record<HttpMethod, string> = {
    GET: 'bg-success text-white',
    POST: 'bg-brand-blue text-white',
    PUT: 'bg-warning text-charcoal-900',
    DELETE: 'bg-error text-white',
    PATCH: 'bg-purple-500 text-white',
  };

  return (
    <span className={cn('px-2 py-1 rounded text-xs font-bold', colors[method])}>
      {method}
    </span>
  );
}

// Parameter type badge
function TypeBadge({ type, required }: { type: ParamType; required: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-text-muted uppercase">{type}</span>
      {required ? (
        <span className="text-xs text-error font-medium">REQUIRED</span>
      ) : (
        <span className="text-xs text-text-dimmed">OPTIONAL</span>
      )}
    </div>
  );
}

// Code block with tabs
interface CodeExampleProps {
  endpoint: ApiEndpoint;
}

function CodeExample({ endpoint }: CodeExampleProps) {
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  const curlCode = `curl -X ${endpoint.method} https://api.deliverability.dev${endpoint.path} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(endpoint.requestExample, null, 2)}'`;

  const nodeCode = `const response = await fetch('https://api.deliverability.dev${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${JSON.stringify(endpoint.requestExample, null, 4)})
});

const data = await response.json();`;

  const pythonCode = `import requests

response = requests.${endpoint.method.toLowerCase()}(
    'https://api.deliverability.dev${endpoint.path}',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json=${JSON.stringify(endpoint.requestExample, null, 4).replace(/"/g, "'")}
)

data = response.json()`;

  const codes = { curl: curlCode, node: nodeCode, python: pythonCode };

  const copyCode = async () => {
    await navigator.clipboard.writeText(codes[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-700 bg-charcoal-900/50">
        <div className="flex items-center gap-1">
          {(['curl', 'node', 'python'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded transition-colors capitalize',
                activeTab === tab
                  ? 'bg-charcoal-700 text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {tab === 'node' ? 'Node.js' : tab}
            </button>
          ))}
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              <span className="text-success">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="p-4 text-sm font-mono text-text-secondary overflow-x-auto">
        <code>{codes[activeTab]}</code>
      </pre>
    </div>
  );
}

// Try it out panel
interface TryItOutProps {
  endpoint: ApiEndpoint;
}

function TryItOut({ endpoint }: TryItOutProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setResponse(endpoint.responseExample);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-4">
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">
          Try It Out
        </h3>
        <div className="space-y-3">
          {endpoint.parameters
            .filter((p) => p.required)
            .slice(0, 2)
            .map((param) => (
              <div key={param.name}>
                <label className="block text-xs text-text-muted mb-1 capitalize">
                  {param.name}
                </label>
                {param.type === 'enum' && param.enumValues ? (
                  <select
                    value={formData[param.name] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [param.name]: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-charcoal-700 border border-charcoal-600 text-sm text-text-primary focus:outline-none focus:border-brand-blue"
                  >
                    <option value="">Select {param.name}</option>
                    {param.enumValues.map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={formData[param.name] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [param.name]: e.target.value })
                    }
                    placeholder={`Enter ${param.name}`}
                    className="bg-charcoal-700 border-charcoal-600 text-text-primary"
                  />
                )}
              </div>
            ))}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-brand-blue hover:bg-brand-blue-hover text-white"
        >
          {loading ? 'Sending...' : 'Send Request'}
        </Button>
      </div>

      {/* Response */}
      {response && (
        <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 overflow-hidden">
          <div className="px-4 py-2 border-b border-charcoal-700 bg-charcoal-900/50">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Response
            </span>
          </div>
          <pre className="p-4 text-sm font-mono text-text-secondary overflow-x-auto max-h-64">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// Main endpoint documentation component
interface EndpointDocProps {
  endpoint: ApiEndpoint;
  breadcrumb?: string[];
}

export function EndpointDoc({ endpoint, breadcrumb = [] }: EndpointDocProps) {
  const [copied, setCopied] = useState(false);

  const copyPath = async () => {
    await navigator.clipboard.writeText(`https://api.deliverability.dev${endpoint.path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-[1fr,400px] gap-8">
      {/* Main content */}
      <div>
        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                <span className={i === breadcrumb.length - 1 ? 'text-text-secondary' : ''}>
                  {item}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Method and path */}
        <div className="flex items-center gap-3 mb-4">
          <MethodBadge method={endpoint.method} />
          <code className="text-sm font-mono text-text-muted">{endpoint.path}</code>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-text-primary mb-4">{endpoint.title}</h1>

        {/* Actions */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={copyPath}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Path'}
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-sm text-text-muted hover:text-text-primary transition-colors">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>

        {/* Description */}
        <p className="text-text-secondary mb-8 leading-relaxed">{endpoint.description}</p>

        {/* Parameters */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">
            Body Parameters
          </h2>
          <div className="space-y-4">
            {endpoint.parameters.map((param) => (
              <div
                key={param.name}
                className="p-4 rounded-lg bg-charcoal-800/50 border border-charcoal-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-semibold text-text-primary">{param.name}</code>
                  <TypeBadge type={param.type} required={param.required} />
                </div>
                <p className="text-sm text-text-muted">{param.description}</p>
                {param.enumValues && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-text-dimmed">Values:</span>
                    {param.enumValues.map((val) => (
                      <code
                        key={val}
                        className="px-1.5 py-0.5 rounded bg-charcoal-700 text-xs text-text-muted"
                      >
                        {val}
                      </code>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info box */}
        <div className="p-4 rounded-lg bg-brand-blue/5 border border-brand-blue/20 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-1">Quotas</h3>
            <p className="text-sm text-text-muted">
              Standard accounts are limited to 50 concurrent tests. Contact sales to upgrade your plan.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="space-y-6">
        <CodeExample endpoint={endpoint} />
        <TryItOut endpoint={endpoint} />
      </div>
    </div>
  );
}
